import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ModalNewList } from '../modal-new-list/modal-new-list.component';
import { TodoService } from '../../services/todo.service';
import { Subscription } from 'rxjs';
import { ListDisplay } from '../list/list-display.component';
import { State } from '../../model/item';
import { List } from '../../model/list';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-home',
    imports: [ListDisplay, DragDropModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class Home implements OnInit, OnDestroy {
    dialog = inject(Dialog);

    private listSubscription?: Subscription;
    private dialogSubscription?: Subscription;
    protected listsToDo?: List[];
    protected listsProgress?: List[];
    protected listsDone?: List[];
    protected isExpanded: Map<string, boolean> = new Map<string, boolean>();

    constructor(private todoService: TodoService) {}

    ngOnInit() {
        this.listSubscription = this.todoService.lists.subscribe(lists => {
            this.listsToDo = lists.filter(list => list.status === State.TODO);
            this.listsProgress = lists.filter(list => list.status === State.IN_PROGRESS);
            this.listsDone = lists.filter(list => list.status === State.DONE);
            lists.forEach(list => {
                this.isExpanded.set(list.id, false);
            });
        });
    }

    ngOnDestroy() {
        this.listSubscription?.unsubscribe();
        this.dialogSubscription?.unsubscribe();
    }

    onCreateList() {
        const dialogRef = this.dialog.open(ModalNewList, {
            width: '400px',
        });

        // Unsubscribe from previous dialog subscription if it exists
        this.dialogSubscription?.unsubscribe();

        dialogRef.closed.subscribe(result => {
            if (result && typeof result === 'string') {
                this.todoService.createList(result);
            }
        });
    }

    isListExpanded(listId: string): boolean {
        return this.isExpanded.get(listId) || false;
    }

    toogleList(event: string): void {
        if (this.isListExpanded(event)) {
            // Collapse current
            this.isExpanded.set(event, false);
        } else {
            // Expand current and collapse others
            this.isExpanded.forEach((_, key) => {
                this.isExpanded.set(key, false);
            });
            this.isExpanded.set(event, true);
        }
    }

    onListDropped(event: any): void {
        const previousContainerId = event.previousContainer.id;
        const currentContainerId = event.container.id;
        console.log('Drop', previousContainerId, currentContainerId, event);
        if (previousContainerId !== currentContainerId) {
            console.log('Moved');
            const list = event.item.data;
            const newStatus = currentContainerId === 'todoList' ? State.TODO : State.IN_PROGRESS;
            this.todoService.updateListStatus(list.id, newStatus);
        }
    }
}
