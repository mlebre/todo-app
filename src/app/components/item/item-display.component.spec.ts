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

    it('should throw when item input is missing', () => {
        const raw = TestBed.createComponent(ItemDisplay);

        expect(() => raw.componentInstance.ngOnInit()).toThrowError('Item input is required');
    });

    it('should trim title and mark new as false when title is valid', () => {
        component.item.title = '  Updated title  ';
        component.item.new = true;

        component.onTitleCreation();

        expect(component.item.title).toBe('Updated title');
        expect(component.item.new).toBeFalse();
    });

    it('should not change item when title is blank', () => {
        component.item.title = '   ';
        component.item.new = true;

        component.onTitleCreation();

        expect(component.item.title).toBe('   ');
        expect(component.item.new).toBeTrue();
    });

    it('should set status done and updatedAt when checkbox is checked', () => {
        const event = { target: { checked: true } } as unknown as Event;

        component.onStatusChange(event);

        expect(component.item.status).toBe(State.DONE);
        expect(component.item.updatedAt).toEqual(jasmine.any(Date));
    });

    it('should set status todo and updatedAt when checkbox is unchecked', () => {
        const event = { target: { checked: false } } as unknown as Event;

        component.onStatusChange(event);

        expect(component.item.status).toBe(State.TODO);
        expect(component.item.updatedAt).toEqual(jasmine.any(Date));
    });

    it('should emit deleted item id', () => {
        spyOn(component.deleteItemId, 'emit');

        component.onDelete(42);

        expect(component.deleteItemId.emit).toHaveBeenCalledWith(42);
    });
});
