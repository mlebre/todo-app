import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef } from '@angular/cdk/dialog';
import { ModalNewList } from './modal-new-list.component';

describe('ModalNewList', () => {
    let component: ModalNewList;
    let fixture: ComponentFixture<ModalNewList>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalNewList],
            providers: [
                {
                    provide: DialogRef,
                    useValue: {
                        close: jasmine.createSpy('close'),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ModalNewList);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
