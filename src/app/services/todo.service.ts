import { Injectable } from '@angular/core';
import { List } from '../model/list';
import { LocalStorageService } from './local-storage.service';
import { State } from '../model/item';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TodoService {
    private lists$: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([]);

    constructor(private localStorageService: LocalStorageService) {
        this.lists$.next(this.localStorageService.loadLists());
    }

    readonly lists = this.lists$.asObservable();

    createList(title: string): Observable<void> {
        const newList: List = {
            id: crypto.randomUUID(),
            title: title,
            items: [],
            createdAt: new Date(),
            status: State.TODO,
        };
        const updatedLists = [...this.lists$.getValue(), newList];
        this.lists$.next(updatedLists);
        this.localStorageService.saveLists(updatedLists);
        return new Observable<void>(observer => {
            observer.next();
            observer.complete();
        });
    }

    deleteList(id: string): Observable<void> {
        const updatedLists = this.lists$.getValue().filter(list => list.id !== id);
        this.lists$.next(updatedLists);
        this.localStorageService.saveLists(updatedLists);
        return new Observable<void>(observer => {
            observer.next();
            observer.complete();
        });
    }

    createItem(listId: string, title: string): Observable<void> {
        const lists = this.lists$.getValue();
        const list = lists.find(l => l.id === listId);
        if (list) {
            list.items.push({
                id: Math.max(0, ...list.items.map(item => item.id)) + 1,
                title: title,
                createdAt: new Date(),
                status: State.TODO,
                new: true,
            });
            this.lists$.next(lists);
            this.localStorageService.saveLists(lists);
        }
        return new Observable<void>(observer => {
            observer.next();
            observer.complete();
        });
    }

    deleteItem(listId: string, itemId: number): Observable<void> {
        const lists = this.lists$.getValue();
        const list = lists.find(l => l.id === listId);
        if (list) {
            list.items = list.items.filter(item => item.id !== itemId);
            list.updatedAt = new Date();
            this.lists$.next(lists);
            this.localStorageService.saveLists(lists);
        }
        return new Observable<void>(observer => {
            observer.next();
            observer.complete();
        });

    }

    updateListStatus(listId: string, newStatus: State): Observable<void> {
        const lists = this.lists$.getValue();
        const list = lists.find(l => l.id === listId);
        if (list) {
            list.status = newStatus;
            list.updatedAt = new Date();
            this.lists$.next(lists);
            this.localStorageService.saveLists(lists);
        }
        return new Observable<void>(observer => {
            observer.next();
            observer.complete();
        });
    }
}
