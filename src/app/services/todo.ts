import { Injectable } from '@angular/core';
import { List } from '../model/list';

@Injectable({
    providedIn: 'root',
})
export class Todo {
    private todos: List[] = [];
    
    getLists(): List[] {
        return this.todos;
    }

    createList(title: string): void {
    }

}
