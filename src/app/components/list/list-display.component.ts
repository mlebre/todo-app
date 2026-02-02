import { Component, Input, OnInit } from '@angular/core';
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

    protected colors?: { light: string, dark: string };

    constructor(private utilService: UtilService) {}

    ngOnInit(): void {
        if (!this.list) {
            throw new Error('List input is required');
        }
        this.colors = this.getAccentColor();
    }

    getAccentColor(): { light: string, dark: string, chevron?: string } { 
        const color = this.utilService.hashIdToHslColor(this.list.id);

        return color;
    }    
}
