import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-product-image-dialog',
    templateUrl: './product-image-dialog.component.html',
    styleUrls: ['./product-image-dialog.component.css']
})
export class ProductImageDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string },
        private dialogRef: MatDialogRef<ProductImageDialogComponent>
    ) { }

    onClose() {
        this.dialogRef.close()
    }
}
