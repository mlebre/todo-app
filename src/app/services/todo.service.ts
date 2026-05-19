import { Injectable } from '@angular/core';
import { List } from '../model/list';
import { State } from '../model/item';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root',
})
export class TodoService {
    private lists$: BehaviorSubject<List[]> = new BehaviorSubject<List[]>([]);

    constructor(private dataService: DataService) {
        this.dataService
            .fetchLists()
            .pipe(
                take(1),
                catchError(() => of([]))
            )
            .subscribe(lists => this.lists$.next(lists));
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

        return this.dataService.saveLists(updatedLists).pipe(
            switchMap(() => this.dataService.fetchLists()),
            tap(fetchedLists => this.lists$.next(fetchedLists)),
            map(() => undefined)
        );
    }

    deleteList(id: string): Observable<void> {
        const updatedLists = this.lists$.getValue().filter(list => list.id !== id);
        return this.dataService.saveLists(updatedLists).pipe(
            switchMap(() => this.dataService.fetchLists()),
            tap(fetchedLists => this.lists$.next(fetchedLists)),
            map(() => undefined)
        );
    }

    createItem(listId: string, title: string): Observable<void> {
        const lists = this.lists$.getValue();
        const list = lists.find(l => l.id === listId);
        if (!list) {
            return of(undefined);
        }

        list.items.push({
            id: Math.max(0, ...list.items.map(item => item.id)) + 1,
            title: title,
            createdAt: new Date(),
            status: State.TODO,
            new: true,
        });

        return this.dataService.saveLists(lists).pipe(
            switchMap(() => this.dataService.fetchLists()),
            tap(fetchedLists => this.lists$.next(fetchedLists)),
            map(() => undefined)
        );
    }

    deleteItem(listId: string, itemId: number): Observable<void> {
        const lists = this.lists$.getValue();
        const list = lists.find(l => l.id === listId);
        if (!list) {
            return of(undefined);
        }

        list.items = list.items.filter(item => item.id !== itemId);
        list.updatedAt = new Date();

        return this.dataService.saveLists(lists).pipe(
            switchMap(() => this.dataService.fetchLists()),
            tap(fetchedLists => this.lists$.next(fetchedLists)),
            map(() => undefined)
        );
    }

    updateListStatus(listId: string, newStatus: State): Observable<void> {
        const lists = this.lists$.getValue();
        const list = lists.find(l => l.id === listId);
        if (!list) {
            return of(undefined);
        }

        list.status = newStatus;
        list.updatedAt = new Date();

        return this.dataService.saveLists(lists).pipe(
            switchMap(() => this.dataService.fetchLists()),
            tap(fetchedLists => this.lists$.next(fetchedLists)),
            map(() => undefined)
        );
    }
}
