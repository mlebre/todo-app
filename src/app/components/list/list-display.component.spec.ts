import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDisplay } from './list-display.component';
import { State } from '../../model/item';
import { TodoService } from '../../services/todo.service';
import { UtilService } from '../../services/util.service';
import { List } from '../../model/list';
import { createTodoServiceMock, createUtilServiceMock } from '../../../testing/mocks/component-mocks';

describe('ListDisplay', () => {
    let component: ListDisplay;
    let fixture: ComponentFixture<ListDisplay>;
    let todoServiceMock: jasmine.SpyObj<TodoService>;
    let utilServiceMock: jasmine.SpyObj<UtilService>;

    const baseList: List = {
        id: 'test-list-1',
        title: 'Test List',
        items: [],
        createdAt: new Date('2024-01-01'),
        status: State.TODO,
    };

    beforeEach(async () => {
        todoServiceMock = createTodoServiceMock(['deleteList', 'createItem', 'deleteItem', 'updateListStatus']);
        utilServiceMock = createUtilServiceMock();

        await TestBed.configureTestingModule({
            imports: [ListDisplay],
            providers: [
                { provide: TodoService, useValue: todoServiceMock },
                { provide: UtilService, useValue: utilServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ListDisplay);
        component = fixture.componentInstance;
        component.list = { ...baseList };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should throw when list input is missing', () => {
        const raw = TestBed.createComponent(ListDisplay);

        expect(() => raw.componentInstance.ngOnInit()).toThrowError('List input is required');
    });

    it('should initialize colors and started status', () => {
        component.list = { ...baseList, status: State.IN_PROGRESS };

        component.ngOnInit();

        expect(utilServiceMock.hashIdToHslColor).toHaveBeenCalledWith('test-list-1');
        expect((component as ListDisplay & { colors: { light: string; dark: string } }).colors).toEqual({
            light: '#ddd',
            dark: '#111',
        });
        expect((component as ListDisplay & { isStarted: boolean }).isStarted).toBeTrue();
    });

    it('should emit list id and toggle expanded state', () => {
        spyOn(component.toogleList, 'emit');
        component.isExpanded = false;

        component.onExpandCollapse();

        expect(component.toogleList.emit).toHaveBeenCalledWith('test-list-1');
        expect(component.isExpanded).toBeTrue();
    });

    it('should delete list by id', () => {
        component.onDeleteList('test-list-1');

        expect(todoServiceMock.deleteList).toHaveBeenCalledWith('test-list-1');
    });

    it('should expand and add item when collapsed', () => {
        component.isExpanded = false;
        spyOn(component, 'onExpandCollapse').and.callThrough();

        component.onAddItem();

        expect(component.onExpandCollapse).toHaveBeenCalled();
        expect(todoServiceMock.createItem).toHaveBeenCalledWith('test-list-1', '');
    });

    it('should add item without toggling when already expanded', () => {
        component.isExpanded = true;
        spyOn(component, 'onExpandCollapse');

        component.onAddItem();

        expect(component.onExpandCollapse).not.toHaveBeenCalled();
        expect(todoServiceMock.createItem).toHaveBeenCalledWith('test-list-1', '');
    });

    it('should delete item from list', () => {
        component.onDeleteItem('test-list-1', 7);

        expect(todoServiceMock.deleteItem).toHaveBeenCalledWith('test-list-1', 7);
    });

    it('should mark in-progress list as done on check', () => {
        component.list = { ...baseList, status: State.IN_PROGRESS };

        component.onCheckList();

        expect(todoServiceMock.updateListStatus).toHaveBeenCalledWith('test-list-1', State.DONE);
    });

    it('should emit undo for non in-progress list on check', () => {
        component.list = { ...baseList, status: State.DONE };
        spyOn(component.undoList, 'emit');

        component.onCheckList();

        expect(component.undoList.emit).toHaveBeenCalledWith('test-list-1');
        expect(todoServiceMock.updateListStatus).not.toHaveBeenCalled();
    });
});
