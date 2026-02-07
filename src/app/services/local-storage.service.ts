import { Injectable } from '@angular/core';
import { List } from '../model/list';
import { Item } from '../model/item';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    saveLists(data: List[]) {
        localStorage.setItem('todoLists', JSON.stringify(data));
    }

    loadLists() {
        const data = localStorage.getItem('todoLists');
        if (data) {
            try {
                const lists = JSON.parse(data) as List[];
                lists.forEach((list: List) => {
                    list.createdAt = new Date(list.createdAt);
                    list.updatedAt = list.updatedAt && new Date(list.updatedAt);
                    list.items.forEach((item: Item) => {
                        item.createdAt = new Date(item.createdAt);
                        item.updatedAt = item.updatedAt && new Date(item.updatedAt);
                        item.dueDate = item.dueDate && new Date(item.dueDate);
                    });
                });
                return lists;
            } catch (e) {
                console.error('Error parsing JSON from localStorage:', e);
                return [];
            }
        }
        return [];
    }
}
