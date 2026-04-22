import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneListComponent } from './done-list.component';
import { Subject } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { List } from '../../model/list';
import { State } from '../../model/item';
import { provideRouter, Router } from '@angular/router';
import {
    createSubscriptionMock,
    createTodoServiceWithListsMock,
    TodoServiceWithListsMock,
} from '../../../testing/mocks/component-mocks';

describe('DoneListComponent', () => {
    let component: DoneListComponent;
    let fixture: ComponentFixture<DoneListComponent>;
    let lists$: Subject<List[]>;
    let todoServiceMock: TodoServiceWithListsMock;
    let router: Router;
    let navigateSpy: jasmine.Spy;

    const makeList = (id: string, status: State): List => ({
        id,
        title: id,
        items: [],
        createdAt: new Date('2024-01-01'),
        status,
    });

    beforeEach(async () => {
        lists$ = new Subject<List[]>();
        todoServiceMock = createTodoServiceWithListsMock(lists$, ['updateListStatus']);

        await TestBed.configureTestingModule({
            imports: [DoneListComponent],
            providers: [{ provide: TodoService, useValue: todoServiceMock }, provideRouter([])],
        }).compileComponents();

        router = TestBed.inject(Router);
        navigateSpy = spyOn(router, 'navigate');

        fixture = TestBed.createComponent(DoneListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should filter done lists and initialize expansion map', () => {
        const todo = makeList('todo', State.TODO);
        const done = makeList('done', State.DONE);

        lists$.next([todo, done]);

        expect((component as DoneListComponent & { listsDone: List[] }).listsDone).toEqual([done]);
        expect(component.isListExpanded('todo')).toBeFalse();
        expect(component.isListExpanded('done')).toBeFalse();
    });

    it('should navigate back to home', () => {
        component.onGoBack();

        expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });

    it('should queue a done list to undo', () => {
        const done = makeList('done', State.DONE);
        (component as DoneListComponent & { listsDone: List[] }).listsDone = [done];

        component.listToUndo('done');

        expect((component as DoneListComponent & { listsToUndo: List[] }).listsToUndo).toEqual([done]);
    });

    it('should update queued lists to in progress and clear queue', () => {
        const one = makeList('one', State.DONE);
        const two = makeList('two', State.DONE);
        (component as DoneListComponent & { listsToUndo: List[] }).listsToUndo = [one, two];

        component.onUndoLists();

        expect(todoServiceMock.updateListStatus).toHaveBeenCalledWith('one', State.IN_PROGRESS);
        expect(todoServiceMock.updateListStatus).toHaveBeenCalledWith('two', State.IN_PROGRESS);
        expect((component as DoneListComponent & { listsToUndo: List[] }).listsToUndo).toEqual([]);
        expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });

    it('should unsubscribe on destroy', () => {
        const subscription = createSubscriptionMock();
        (component as unknown as Record<string, unknown>)['listSubscription'] = subscription;

        component.ngOnDestroy();

        expect(subscription.unsubscribe).toHaveBeenCalled();
    });
});
