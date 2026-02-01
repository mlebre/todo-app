import { Component, Input } from '@angular/core';
import { List } from '../../model/list';

@Component({
  selector: 'app-list-display',
  imports: [],
  templateUrl: './list-display.component.html',
  styleUrl: './list-display.component.css',
})
export class ListDisplay {
  @Input() list!: List;
}
