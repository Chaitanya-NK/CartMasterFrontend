import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Coupon } from 'src/app/models/coupon';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-admin-coupons',
    templateUrl: './admin-coupons.component.html',
    styleUrls: ['./admin-coupons.component.css']
})
export class AdminCouponsComponent implements OnInit {

    addCouponForm: FormGroup;
    coupons: Coupon[] = [];
    editingCoupon: Coupon | null = null;
    displayedColumns: string[] = ['couponName', 'couponDescription', 'validFrom', 'validTo','discountPercentage', 'isValid', 'actions'];
    dataSource: MatTableDataSource<Coupon>
    addEditCouponLoading: boolean = false
    loading: boolean = true;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private fb: FormBuilder,
        private commonService: CommonServiceService,
        private snackBar: MatSnackBar,
        private spinnserService: NgxSpinnerService
    ) {
        this.addCouponForm = this.fb.group({
            couponName: ['', Validators.required],
            couponDescription: ['', Validators.required],
            validFrom: ['', Validators.required],
            validTo: ['', Validators.required],
            // isValid: ['', Validators.required],
            discountPercentage: ['', Validators.required]
        });
        this.dataSource = new MatTableDataSource<Coupon>(this.coupons)
    }

    ngOnInit() {
        this.spinnserService.show()
        setTimeout(() => {
            this.loadCoupons();
            this.spinnserService.hide()
            this.loading = false
        }, 2000);
    }

    loadCoupons() {
        this.commonService.post(`${environment.coupons.handleCoupons}?action=getall`, null).subscribe(
            (data: any) => {
                this.coupons = data;
                this.dataSource = new MatTableDataSource<Coupon>(this.coupons)
                this.dataSource.paginator = this.paginator
                this.dataSource.sort = this.sort
            }
        );
    }

    onSubmit(): void {
        const couponData = this.addCouponForm.value;
        this.addEditCouponLoading = true

        const currentDate = new Date();
        const validFromDate = new Date(couponData.validFrom)
        const validToDate = new Date(couponData.validTo)

        couponData.isValid = currentDate >= validFromDate && currentDate <= validToDate

        const action = this.editingCoupon ? 'update' : 'add'
        const requestBody = this.editingCoupon
            ? { ...couponData, couponId: this.editingCoupon.couponID }
            : couponData
        
        this.commonService.post(`${environment.coupons.handleCoupons}?action=${action}`, requestBody)
            .subscribe((response: any) => {
                if(response.success === true) {
                    this.snackBar.open(
                        this.editingCoupon ? 'Coupon updated successfully' : 'Coupon added successfully',
                        "Close",
                        { duration: 3000 }
                    )
                    this.resetForm()
                    this.loadCoupons()
                } else {
                    this.snackBar.open(
                        this.editingCoupon ? 'Coupon update failed' : 'Coupon addition failed',
                        'Close',
                        { duration: 3000 }
                    );
                }
                this.addEditCouponLoading = false
            })
    }

    editCoupon(coupon: Coupon) {
        this.editingCoupon = coupon;
        this.addCouponForm.patchValue({
            couponName: coupon.couponName,
            couponDescription: coupon.couponDescription,
            validFrom: coupon.validFrom,
            validTo: coupon.validTo,
            isValid: coupon.isValid,
            discountPercentage: coupon.discountPercentage
        });
    }

    resetForm() {
        this.addCouponForm.reset();
        this.editingCoupon = null;
    }
}
