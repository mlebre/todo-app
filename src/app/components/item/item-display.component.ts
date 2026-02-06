import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item, State } from '../../model/item';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-item-display',
    imports: [FormsModule],
    templateUrl: './item-display.component.html',
    styleUrl: './item-display.component.css',
})
export class ItemDisplay implements OnInit {
    @Input() item!: Item;

    @Output() deleteItemId: EventEmitter<number> = new EventEmitter<number>();

    ngOnInit(): void {
        if (!this.item) {
            throw new Error('Item input is required');
        }
    }

    onTitleCreation(): void {
        if (this.item.title && this.item.title.trim()) {
            this.item.new = false;
            this.item.title = this.item.title.trim();
        }
    }

    onStatusChange(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        this.item.status = checkbox.checked ? State.DONE : State.TODO;
        this.item.updatedAt = new Date();
    }

    onDelete(id: number): void {
        this.deleteItemId.emit(id);
    }
}
