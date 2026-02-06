import { Injectable } from '@angular/core';
import { List } from '../model/list';
import { LocalStorageService } from './local-storage.service';
import { State } from '../model/item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TodoService {
    private lists$: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([]);

    constructor(private localStorageService: LocalStorageService) {
        this.lists$.next(this.localStorageService.loadLists());
    }

    readonly lists = this.lists$.asObservable();

    createList(title: string): void {
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
    }

    deleteList(id: string): void {
        const updatedLists = this.lists$.getValue().filter(list => list.id !== id);
        this.lists$.next(updatedLists);
        this.localStorageService.saveLists(updatedLists);
    }

    createItem(listId: string, title: string): void {
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
    }

    deleteItem(listId: string, itemId: number): void {
        const lists = this.lists$.getValue();
        const list = lists.find(l => l.id === listId);
        if (list) {
            list.items = list.items.filter(item => item.id !== itemId);
            list.updatedAt = new Date();
            this.lists$.next(lists);
            this.localStorageService.saveLists(lists);
        }
    }
}
