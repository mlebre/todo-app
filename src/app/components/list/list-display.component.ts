import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { List } from '../../model/list';
import { UtilService } from '../../services/util.service';
import { TodoService } from '../../services/todo.service';
import { ItemDisplay } from '../item/item-display.component';
import { State } from '../../model/item';

@Component({
    selector: 'app-list-display',
    imports: [ItemDisplay],
    templateUrl: './list-display.component.html',
    styleUrl: './list-display.component.css',
})
export class ListDisplay implements OnInit {
    @Input() list!: List;
    @Input() isExpanded = false;

    protected colors?: { light: string; dark: string };
    protected isInProgress = false;

    @Output() toogleList: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private utilService: UtilService,
        private todoService: TodoService
    ) {}

    ngOnInit(): void {
        if (!this.list) {
            throw new Error('List input is required');
        }
        this.colors = this.utilService.hashIdToHslColor(this.list.id);
        this.isInProgress = this.list.status === State.IN_PROGRESS;
    }

    onExpandCollapse(): void {
        this.toogleList.emit(this.list.id);
        this.isExpanded = !this.isExpanded;
    }

    onDeleteList(id: string): void {
        this.todoService.deleteList(id);
    }

    onAddItem(): void {
        if (!this.isExpanded) {
            this.onExpandCollapse();
        }
        this.todoService.createItem(this.list.id, '');
    }

    onDeleteItem(listId: string, itemId: number): void {
        this.todoService.deleteItem(listId, itemId);
    }

    onCompleteList(): void {
        this.todoService.updateListStatus(this.list.id, State.DONE);
    }
}
