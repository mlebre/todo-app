import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDisplay } from './list-display.component';

describe('ListDisplay', () => {
    let component: ListDisplay;
    let fixture: ComponentFixture<ListDisplay>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ListDisplay],
        }).compileComponents();

        fixture = TestBed.createComponent(ListDisplay);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
