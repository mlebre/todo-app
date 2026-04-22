import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { of, Subject } from 'rxjs';
import { provideRouter, Router } from '@angular/router';

import { Home } from './home.component';
import { TodoService } from '../../services/todo.service';
import { List } from '../../model/list';
import { State } from '../../model/item';
import {
    createSubscriptionMock,
    createTodoServiceWithListsMock,
    TodoServiceWithListsMock,
} from '../../../testing/mocks/component-mocks';

describe('Home', () => {
    let component: Home;
    let fixture: ComponentFixture<Home>;
    let lists$: Subject<List[]>;
    let todoServiceMock: TodoServiceWithListsMock;
    let router: Router;
    let dialog: Dialog;
    let navigateSpy: jasmine.Spy;
    let openSpy: jasmine.Spy;

    const makeList = (id: string, status: State): List => ({
        id,
        title: id,
        items: [],
        createdAt: new Date('2024-01-01'),
        status,
    });

    beforeEach(async () => {
        lists$ = new Subject<List[]>();
        todoServiceMock = createTodoServiceWithListsMock(lists$, ['createList', 'updateListStatus']);

        await TestBed.configureTestingModule({
            imports: [Home, DialogModule],
            providers: [{ provide: TodoService, useValue: todoServiceMock }, provideRouter([])],
        }).compileComponents();

        router = TestBed.inject(Router);
        dialog = TestBed.inject(Dialog);
        navigateSpy = spyOn(router, 'navigate');
        openSpy = spyOn(dialog, 'open');

        fixture = TestBed.createComponent(Home);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should partition lists by status on init', () => {
        const todo = makeList('todo-1', State.TODO);
        const progress = makeList('progress-1', State.IN_PROGRESS);
        const done = makeList('done-1', State.DONE);

        lists$.next([todo, progress, done]);

        expect((component as Home & { listsToDo: List[] }).listsToDo).toEqual([todo]);
        expect((component as Home & { listsProgress: List[] }).listsProgress).toEqual([progress]);
        expect((component as Home & { listsDone: List[] }).listsDone).toEqual([done]);
    });

    it('should create list from dialog result and collapse expanded lists', () => {
        const previousSubscription = createSubscriptionMock();
        (component as unknown as Record<string, unknown>)['dialogSubscription'] = previousSubscription;
        (component as Home & { isExpanded: Map<string, boolean> }).isExpanded.set('a', true);
        (component as Home & { isExpanded: Map<string, boolean> }).isExpanded.set('b', true);
        openSpy.and.returnValue({ closed: of('New List') } as never);

        component.onCreateList();

        expect(previousSubscription.unsubscribe).toHaveBeenCalled();
        expect(todoServiceMock.createList).toHaveBeenCalledWith('New List');
        expect(component.isListExpanded('a')).toBeFalse();
        expect(component.isListExpanded('b')).toBeFalse();
    });

    it('should not create list when dialog result is invalid', () => {
        openSpy.and.returnValue({ closed: of(null) } as never);

        component.onCreateList();

        expect(todoServiceMock.createList).not.toHaveBeenCalled();
    });

    it('should toggle list expansion and collapse others', () => {
        (component as Home & { isExpanded: Map<string, boolean> }).isExpanded.set('one', false);
        (component as Home & { isExpanded: Map<string, boolean> }).isExpanded.set('two', true);

        component.toogleList('one');
        expect(component.isListExpanded('one')).toBeTrue();
        expect(component.isListExpanded('two')).toBeFalse();

        component.toogleList('two');
        expect(component.isListExpanded('one')).toBeFalse();
        expect(component.isListExpanded('two')).toBeTrue();
    });

    it('should reorder list in same container without status update', () => {
        const containerData = [1, 2, 3];
        const sharedContainer = { data: containerData, id: 'todoList' };
        const event = {
            previousContainer: sharedContainer,
            container: sharedContainer,
            previousIndex: 0,
            currentIndex: 2,
            item: { data: makeList('x', State.TODO) },
        };

        component.onListDropped(event);

        expect(containerData).toEqual([2, 3, 1]);
        expect(todoServiceMock.updateListStatus).not.toHaveBeenCalled();
    });

    it('should transfer list between containers and update its status', () => {
        const todoList = [makeList('todo-1', State.TODO)];
        const progressList: List[] = [];
        const event = {
            previousContainer: { data: todoList },
            container: { data: progressList, id: 'progressList' },
            previousIndex: 0,
            currentIndex: 0,
            item: { data: makeList('todo-1', State.TODO) },
        };

        component.onListDropped(event);

        expect(todoList.length).toBe(0);
        expect(progressList.length).toBe(1);
        expect(todoServiceMock.updateListStatus).toHaveBeenCalledWith('todo-1', State.IN_PROGRESS);
    });

    it('should navigate to done lists page', () => {
        component.onViewDoneLists();

        expect(navigateSpy).toHaveBeenCalledWith(['/done']);
    });

    it('should unsubscribe subscriptions on destroy', () => {
        const listSubscription = createSubscriptionMock();
        (component as unknown as Record<string, unknown>)['listSubscription'] = listSubscription;

        const dialogClosed$ = new Subject<string>();
        openSpy.and.returnValue({ closed: dialogClosed$ } as never);
        component.onCreateList();

        const dialogSubscription = (component as unknown as Record<string, { unsubscribe: () => void }>)[
            'dialogSubscription'
        ];
        const dialogUnsubscribeSpy = spyOn(dialogSubscription, 'unsubscribe').and.callThrough();

        component.ngOnDestroy();

        expect(listSubscription.unsubscribe).toHaveBeenCalled();
        expect(dialogUnsubscribeSpy).toHaveBeenCalled();
    });
});
