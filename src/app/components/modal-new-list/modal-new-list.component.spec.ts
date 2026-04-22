import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef } from '@angular/cdk/dialog';
import { ModalNewList } from './modal-new-list.component';
import { createDialogRefMock } from '../../../testing/mocks/component-mocks';

describe('ModalNewList', () => {
    let component: ModalNewList;
    let fixture: ComponentFixture<ModalNewList>;
    let dialogRefMock: { close: jasmine.Spy };

    beforeEach(async () => {
        dialogRefMock = createDialogRefMock();

        await TestBed.configureTestingModule({
            imports: [ModalNewList],
            providers: [
                {
                    provide: DialogRef,
                    useValue: dialogRefMock,
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

    it('should close with title on confirm when title is valid', () => {
        component.title = 'New List';

        component.onConfirm();

        expect(dialogRefMock.close).toHaveBeenCalledWith('New List');
    });

    it('should not close on confirm when title is blank', () => {
        component.title = '   ';

        component.onConfirm();

        expect(dialogRefMock.close).not.toHaveBeenCalled();
    });

    it('should close without args on cancel', () => {
        component.onCancel();

        expect(dialogRefMock.close).toHaveBeenCalledWith();
    });
});
