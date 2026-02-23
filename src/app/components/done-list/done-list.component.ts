import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageLayout } from '../page-layout/page-layout.component';
import { List } from '../../model/list';
import { TodoService } from '../../services/todo.service';
import { Router } from '@angular/router';
import { State } from '../../model/item';
import { Subscription } from 'rxjs';
import { ListDisplay } from '../list/list-display.component';

@Component({
    selector: 'app-done-list.component',
    imports: [PageLayout, ListDisplay],
    templateUrl: './done-list.component.html',
    styleUrl: './done-list.component.css',
})
export class DoneListComponent implements OnInit, OnDestroy {
    protected listsDone?: List[];
    protected listsToUndo: List[] = [];
    protected isExpanded: Map<string, boolean> = new Map<string, boolean>();
    private listSubscription?: Subscription;

    constructor(
        private todoService: TodoService,
        protected router: Router
    ) {}

    ngOnInit() {
        this.listSubscription = this.todoService.lists.subscribe(lists => {
            this.listsDone = lists.filter(list => list.status === State.DONE);
            lists.forEach(list => {
                this.isExpanded.set(list.id, false);
            });
        });
    }

    ngOnDestroy() {
        this.listSubscription?.unsubscribe();
    }

    isListExpanded(listId: string): boolean {
        return this.isExpanded.get(listId) || false;
    }

    onGoBack() {
        this.router.navigate(['/']);
    }

    listToUndo(listId: string) {
        this.listsToUndo.push(this.listsDone?.find(list => list.id === listId) as List);
    }

    onUndoLists() {
        this.listsToUndo.forEach(list => {
            this.todoService.updateListStatus(list.id, State.IN_PROGRESS);
        });
        this.listsToUndo = [];
    }
}
