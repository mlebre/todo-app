import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
    selector: 'app-modal-new-list',
    imports: [FormsModule],
    templateUrl: './modal-new-list.component.html',
    styleUrl: './modal-new-list.component.css',
})
export class ModalNewList {
    dialogRef = inject(DialogRef);

    title = '';

    onConfirm() {
        if (this.title.trim()) {
            this.dialogRef.close(this.title);
        }
    }

    onCancel() {
        this.dialogRef.close();
    }
}
