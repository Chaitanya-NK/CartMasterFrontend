import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-coupon-dialog',
    templateUrl: './coupon-dialog.component.html',
    styleUrls: ['./coupon-dialog.component.css']
})
export class CouponDialogComponent {
    coupons: any[] = [];
    displayedColumns: string[] = ['couponName', 'couponDescription', 'discountPercentage', 'apply'];

    constructor(
        public dialogRef: MatDialogRef<CouponDialogComponent>,
        private commonService: CommonServiceService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadCoupons();
    }

    loadCoupons(): void {
        this.commonService.post(`${environment.coupons.handleCoupons}?action=getvalid&isValid=true`, null)
            .subscribe((data: any) => {
                this.coupons = data;
            });
    }

    applyCoupon(coupon: any): void {
        // Implement the logic for applying the coupon here.
        this.dialogRef.close(coupon);
        this.snackBar.open(`Coupon "${coupon.couponName}" applied successfully!`, 'Close', { duration: 3000 });
    }
}
