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
            status : State.TODO 
        };
        const updatedLists = [...this.lists$.getValue(), newList];
        this.lists$.next(updatedLists)
        this.localStorageService.saveLists(updatedLists);
    }

}
