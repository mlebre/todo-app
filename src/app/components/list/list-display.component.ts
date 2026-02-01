import { Component, Input, OnInit } from '@angular/core';
import { List } from '../../model/list';

@Component({
    selector: 'app-list-display',
    imports: [],
    templateUrl: './list-display.component.html',
    styleUrl: './list-display.component.css',
})
export class ListDisplay implements OnInit {
    @Input() list!: List;

    ngOnInit(): void {
        if (!this.list) {
            throw new Error('List input is required');
        }
    }
}
