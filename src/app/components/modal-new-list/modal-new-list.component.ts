import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';


@Component({
    selector: 'app-modal-new-list',
    imports: [CommonModule, FormsModule],
    templateUrl: './modal-new-list.component.html',
    styleUrl: './modal-new-list.component.css',
})
export class ModalNewList {
    dialogRef = inject(DialogRef);
    data = inject(DIALOG_DATA);

    title: string = '';

    onConfirm() {
        if (this.title.trim()) {
            this.dialogRef.close(this.title);
        }
    }

    onCancel() {
        this.dialogRef.close();
    }
}
