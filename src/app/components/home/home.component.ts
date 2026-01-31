import { Dialog } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ModalNewList } from '../modal-new-list/modal-new-list.component';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class Home {
    dialog = inject(Dialog);

    onCreateList(event: Event) {
        const dialogRef = this.dialog.open(ModalNewList, {
            width: '400px',
        });

        dialogRef.closed.subscribe(result => {
            if (result) {
                console.log('New list title:', result);
                // Add your list creation logic here
            }
        });
    }

}
