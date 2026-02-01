import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ModalNewList } from '../modal-new-list/modal-new-list.component';
import { TodoService } from '../../services/todo.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Subscription } from 'rxjs';
import { ListDisplay } from '../list/list-display.component';
import { State } from '../../model/item';
import { List } from '../../model/list';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    imports: [ListDisplay, CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class Home implements OnInit, OnDestroy {
    dialog = inject(Dialog);

    private listSubscription?: Subscription;
    protected listsToDo?: List[];
    protected listsProgress?: List[];
    protected listsDone?: List[];

    constructor(
        private localStorageService: LocalStorageService,
        private todoService: TodoService
    ) {}

    ngOnInit() {
        this.listSubscription = this.todoService.lists.subscribe(lists => {
            this.listsToDo = lists.filter(list => list.status === State.TODO);
            this.listsProgress = lists.filter(list => list.status === State.IN_PROGRESS);
            this.listsDone = lists.filter(list => list.status === State.DONE);
        });
    }

    ngOnDestroy() {
        this.listSubscription?.unsubscribe();
    }

    onCreateList() {
        const dialogRef = this.dialog.open(ModalNewList, {
            width: '400px',
        });

        dialogRef.closed.subscribe(result => {
            if (result && typeof result === 'string') {
                console.log('New list title:', result);
                this.todoService.createList(result);
            }
        });
    }
}
