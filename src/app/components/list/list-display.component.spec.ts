import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDisplay } from './list-display.component';
import { State } from '../../model/item';

describe('ListDisplay', () => {
    let component: ListDisplay;
    let fixture: ComponentFixture<ListDisplay>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ListDisplay],
        }).compileComponents();

        fixture = TestBed.createComponent(ListDisplay);
        component = fixture.componentInstance;
        component.list = {
            id: 'test-list-1',
            title: 'Test List',
            items: [],
            createdAt: new Date(),
            status: State.TODO,
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
