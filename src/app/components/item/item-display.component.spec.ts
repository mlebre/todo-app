import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemDisplay } from './item-display.component';
import { State } from '../../model/item';

describe('ItemDisplay', () => {
    let component: ItemDisplay;
    let fixture: ComponentFixture<ItemDisplay>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ItemDisplay],
        }).compileComponents();

        fixture = TestBed.createComponent(ItemDisplay);
        component = fixture.componentInstance;
        component.item = {
            id: 1,
            title: 'Test Item',
            new: false,
            status: State.TODO,
            createdAt: new Date(),
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
