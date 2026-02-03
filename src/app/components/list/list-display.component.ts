import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { List } from '../../model/list';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'app-list-display',
    imports: [],
    templateUrl: './list-display.component.html',
    styleUrl: './list-display.component.css',
})
export class ListDisplay implements OnInit {
    @Input() list!: List;
    @Input() isExpanded = false;

    protected colors?: { light: string; dark: string };

    protected toogleList: EventEmitter<string> = new EventEmitter<string>();

    constructor(private utilService: UtilService) {}

    ngOnInit(): void {
        if (!this.list) {
            throw new Error('List input is required');
        }
        this.colors = this.utilService.hashIdToHslColor(this.list.id);
    }

    onExpandCollapse(): void {
        console.log(`Expand/Collapse list ${this.list.id}`);
        this.toogleList.emit(this.list.id);
        this.isExpanded = !this.isExpanded;
    }

    onAddItem(): void {
        console.log(`Add item to list ${this.list.id}`);
    }
}
