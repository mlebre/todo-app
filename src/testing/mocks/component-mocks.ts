import { Dialog } from '@angular/cdk/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { List } from '../../app/model/list';
import { TodoService } from '../../app/services/todo.service';
import { UtilService } from '../../app/services/util.service';

export type TodoServiceWithListsMock = jasmine.SpyObj<TodoService> & {
    lists: Subject<List[]>;
};

export function createTodoServiceWithListsMock(lists$: Subject<List[]>, methods: string[]): TodoServiceWithListsMock {
    return jasmine.createSpyObj('TodoService', methods, {
        lists: lists$,
    }) as TodoServiceWithListsMock;
}

export function createTodoServiceMock(methods: string[]): jasmine.SpyObj<TodoService> {
    return jasmine.createSpyObj('TodoService', methods);
}

export function createUtilServiceMock(colors = { light: '#ddd', dark: '#111' }): jasmine.SpyObj<UtilService> {
    const utilServiceMock = jasmine.createSpyObj<UtilService>('UtilService', ['hashIdToHslColor']);
    utilServiceMock.hashIdToHslColor.and.returnValue(colors);
    return utilServiceMock;
}

export function createRouterMock(): jasmine.SpyObj<Router> {
    return jasmine.createSpyObj<Router>('Router', ['navigate']);
}

export function createDialogMock(): jasmine.SpyObj<Dialog> {
    return jasmine.createSpyObj<Dialog>('Dialog', ['open']);
}

export function createDialogRefMock(): { close: jasmine.Spy } {
    return {
        close: jasmine.createSpy('close'),
    };
}

export function createSubscriptionMock(): { unsubscribe: jasmine.Spy } {
    return jasmine.createSpyObj('Subscription', ['unsubscribe']);
}
