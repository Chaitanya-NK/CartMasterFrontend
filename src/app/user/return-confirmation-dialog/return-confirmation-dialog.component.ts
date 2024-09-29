import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-return-confirmation-dialog',
    templateUrl: './return-confirmation-dialog.component.html',
    styleUrls: ['./return-confirmation-dialog.component.css']
})
export class ReturnConfirmationDialogComponent {

    constructor(public dialogRef: MatDialogRef<ReturnConfirmationDialogComponent>) {}

    onCancel(): void {
        this.dialogRef.close()
    }

    onConfirm(): void {
        this.dialogRef.close(true)
    }
}
