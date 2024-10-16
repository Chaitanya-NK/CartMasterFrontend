import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartItem } from '../../models/cart-item';
import { CommonServiceService } from '../../services/common-service.service';
import { environment } from 'src/environments/environment.development';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CouponDialogComponent } from '../coupon-dialog/coupon-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Coupon } from 'src/app/models/coupon';
import { AmountService } from 'src/app/services/amount.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

    cartItems: CartItem[] = []
    totalAmount: number = 0
    gstAmount: number = 0
    finalAmount: number = 0
    loading: boolean = true
    columnCount: number = 5
    rowCount: number = 3
    discountAmount: number = 0
    discountedFinalAmount: number = 0
    couponApplied: boolean = false
    couponId: number = 0

    displayedColumns: string[] = ['image', 'productname', 'quantity', 'price', 'actions']
    dataSource = new MatTableDataSource<any>(this.cartItems)

    sessionID: string | null = localStorage.getItem('sessionID')

    constructor(
        private commonService: CommonServiceService,
        private router: Router,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private spinnerService: NgxSpinnerService
    ) { }

    ngOnInit(): void {
        this.spinnerService.show()

        setTimeout(() => {
            this.loadCartItems()
            this.spinnerService.hide()
            this.loading = false
        }, 1500)
    }

    loadCartItems() {
        const token: any = localStorage.getItem('token')
        const decodedToken = JSON.parse(atob(token.split('.')[1]))
        const userID = decodedToken.UserID
        this.commonService.post<CartItem[]>(`${environment.cart.handleCart}?action=getbyid&userId=${userID}`, null).subscribe((items: CartItem[]) => {
            this.cartItems = items
            this.dataSource.data = this.cartItems
            this.calculateAmount()
        })
    }

    calculateAmount() {
        this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        this.gstAmount = this.totalAmount * 0.18
        this.finalAmount = this.totalAmount + this.gstAmount
        this.discountedFinalAmount = this.couponApplied ? this.finalAmount - this.discountAmount : this.finalAmount
    }

    removeFromCart(cartID: number, productId: number) {
        this.commonService.post(`${environment.cart.handleCart}?action=delete&cartId=${cartID}&productId=${productId}`, null).subscribe(
            (response: any) => {
                if (response.success === true) {
                    this.snackBar.open("Item removed from cart successfully", "Close", { duration: 3000 })
                    this.loadCartItems()
                } else {
                    this.snackBar.open("Item failed to remove from cart", "Close", { duration: 3000 })
                    this.loadCartItems()
                }
            }
        )
    }

    proceedToOrder() {
        this.router.navigate([this.sessionID + '/checkout'])
    }

    openCouponDialog(): void {
        const dialogRef = this.dialog.open(CouponDialogComponent, {
            width: '500px'
        });

        dialogRef.afterClosed().subscribe((coupon: Coupon) => {
            if (coupon) {
                // Handle the coupon application logic here
                this.couponId = coupon.couponID
                localStorage.setItem('CouponID: ', this.couponId.toLocaleString())
                this.couponApplied = true
                this.discountAmount = this.finalAmount * (coupon.discountPercentage / 100)
                this.discountedFinalAmount = this.finalAmount - this.discountAmount

                this.snackBar.open(`Coupon "${coupon.couponName}" applied!`, "Close", { duration: 2000 })
                this.calculateAmount()
            }
        });
    }
}
