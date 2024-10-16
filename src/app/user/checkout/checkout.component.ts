import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../../services/common-service.service';
import { CartItem } from '../../models/cart-item';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user';
import { MatDialog } from '@angular/material/dialog';
import { PaymentUnderwayDialogComponent } from '../payment-underway-dialog/payment-underway-dialog.component';
import { CouponDialogComponent } from '../coupon-dialog/coupon-dialog.component';
import { Coupon } from 'src/app/models/coupon';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    cartItems: any[] = [];
    totalAmount: number = 0
    gstAmount: number = 0
    finalAmount: number = 0
    displayedColumns: string[] = ['image', 'productName', 'quantity', 'price'];
    addressForm: FormGroup;
    paymentForm: FormGroup;
    selectedPaymentMethod: string = 'card'; // Default payment method
    user: User | null = null
    addressExists: boolean = false
    editAddressMode: boolean = false
    discountAmount: number = 0
    discountedFinalAmount: number = 0
    couponApplied: boolean = false
    couponId: number = 0
    loading: boolean = true

    sessionID: string | null = localStorage.getItem('sessionID')

    constructor(
        private commonService: CommonServiceService,
        private fb: FormBuilder,
        private router: Router,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private spinnerService: NgxSpinnerService
    ) {
        this.addressForm = this.fb.group({
            address: ['', Validators.required]
        });

        this.paymentForm = this.fb.group({
            cardName: ['', Validators.required],
            cardNumber: ['', Validators.required],
            expiryDate: ['', Validators.required],
            cvv: ['', Validators.required],
            upiId: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.spinnerService.show()

        setTimeout(() => {
            this.loadCartItems();
            this.loadAddress()
            this.spinnerService.hide()
            this.loading = false
        }, 1500);
    }

    loadCartItems() {
        const token: any = localStorage.getItem('token')
        const decodedToken = JSON.parse(atob(token.split('.')[1]))
        const userID = decodedToken.UserID
        this.commonService.post<CartItem[]>(`${environment.cart.handleCart}?action=getbyid&userId=${userID}`, null).subscribe((items: CartItem[]) => {
            this.cartItems = items
            this.calculateAmount()
        })
    }

    loadAddress() {
        const userId = this.commonService.getUserIdFromToken()
        this.commonService.getById(environment.users.getAddress, { userId: userId }).subscribe(
            (response: any) => {
                if (response) {
                    this.addressExists = true
                    this.addressForm.patchValue({
                        address: response
                    })
                }
            }
        )
    }

    editAddress() {
        this.editAddressMode = true
        this.addressForm.get('address')?.enable()
    }

    calculateAmount() {
        this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        this.gstAmount = this.totalAmount * 0.18
        this.finalAmount = this.totalAmount + this.gstAmount
    }

    saveAddress() {
        const userId = this.commonService.getUserIdFromToken()
        const formData = this.addressForm.value
        const addressString = encodeURIComponent(JSON.stringify(formData.address))
        this.commonService.put(environment.users.saveAddress + `?userId=${userId}&address=${addressString}`, {}).subscribe(
            (response: any) => {
                if (response.success === true) {
                    this.snackBar.open("Address Saved", "Close", { duration: 3000 })
                    this.addressExists = true
                    this.editAddressMode = false
                    this.addressForm.get('address')?.disable()
                } else {
                    this.snackBar.open("Failed to Save Address", "Close", { duration: 3000 })
                }
            }
        )
    }

    cancelEdit() {
        this.editAddressMode = false
        this.addressForm.get('address')?.disable()
    }

    openCouponDialog(): void {
        const dialogRef = this.dialog.open(CouponDialogComponent, {
            width: '500px'
        });

        dialogRef.afterClosed().subscribe((coupon: Coupon) => {
            if (coupon) {
                // Handle the coupon application logic here
                this.couponId = coupon.couponID
                this.couponApplied = true
                this.discountAmount = this.finalAmount * (coupon.discountPercentage / 100)
                this.discountedFinalAmount = this.finalAmount - this.discountAmount

                this.snackBar.open(`Coupon "${coupon.couponName}" applied!`, "Close", { duration: 2000 })
                this.calculateAmount()
            }
        });
    }

    // placeOrder() {
    //     const dialogRef = this.dialog.open(PaymentUnderwayDialogComponent, {
    //         disableClose: true
    //     })

    //     setTimeout(() => {
    //         dialogRef.close()
    //     }, 3000);

    //     const token: any = localStorage.getItem('token')
    //     const decodedToken = JSON.parse(atob(token.split('.')[1]))
    //     const userID = decodedToken.UserID

    //     this.commonService.post<any>(`${environment.orders.handleOrder}?action=add&userId=${userID}&totalAmount=${this.discountedFinalAmount}&couponId=${this.couponId}`, null).subscribe(
    //         response => {
    //             if (response && response.success === true) {
    //                 setTimeout(() => {
    //                     this.snackBar.open("Order placed successfully", "Close", {
    //                         verticalPosition: 'top',
    //                         horizontalPosition: 'right'
    //                     })
    //                     this.router.navigate([this.sessionID + '/payment-status'], { queryParams: { status: 'true' } })
    //                 }, 3500);
    //             } else {
    //                 this.snackBar.open("Order failed", "Close", {
    //                     verticalPosition: 'top',
    //                     horizontalPosition: 'right'
    //                 })
    //             }
    //         },
    //         error => {
    //             console.log(error);
    //             this.snackBar.open("Order failed", "Close", {
    //                 verticalPosition: 'top',
    //                 horizontalPosition: 'right'
    //             })
    //         }
    //     )
    // }

    placeOrder() {
        // Show the payment underway dialog
        const dialogRef = this.dialog.open(PaymentUnderwayDialogComponent, {
            disableClose: true
        });
    
        setTimeout(() => {
            dialogRef.close();
        }, 3000);
    
        const token: any = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userID = decodedToken.UserID;
    
        // Prepare order data
        const orderData = {
            userId: userID,
            totalAmount: this.discountedFinalAmount || this.finalAmount,
            couponId: this.couponId || null,
            paymentMethod: this.selectedPaymentMethod
        };
    
        // Call payment method based on the selected option
        if (this.selectedPaymentMethod === 'card') {
            this.processCardPayment(orderData);
        } else if (this.selectedPaymentMethod === 'upi') {
            this.processUPIPayment(orderData);
        } else if (this.selectedPaymentMethod === 'cod') {
            this.createOrder(orderData);  // For COD, proceed directly to order creation
        }
    }
    
    // Process Card Payment
    processCardPayment(orderData: any) {
        const paymentData = {
            paymentMethod: 'Card',
            cardName: this.paymentForm.value.cardName,
            cardNumber: this.paymentForm.value.cardNumber,
            expiryDate: this.paymentForm.value.expiryDate,
            cvv: this.paymentForm.value.cvv
        };
    
        // Send payment details to the payment API
        this.commonService.post<any>(`${environment.payments.handlePayment}?action=add`, paymentData).subscribe(
            (paymentResponse) => {
                if (paymentResponse.success) {
                    // Proceed to order creation after successful payment
                    this.createOrder(orderData);
                } else {
                    this.snackBar.open("Payment failed", "Close", { duration: 3000 });
                }
            },
            (error) => {
                console.log(error);
                this.snackBar.open("Payment failed", "Close", { duration: 3000 });
            }
        );
    }
    
    // Process UPI Payment
    processUPIPayment(orderData: any) {
        const paymentData = {
            paymentMethod: 'UPI',
            upiId: this.paymentForm.value.upiId
        };
    
        // Send UPI details to the payment API
        this.commonService.post<any>(`${environment.payments.handlePayment}?action=add`, paymentData).subscribe(
            (paymentResponse) => {
                if (paymentResponse.success) {
                    // Proceed to order creation after successful payment
                    this.createOrder(orderData);
                } else {
                    this.snackBar.open("UPI Payment failed", "Close", { duration: 3000 });
                }
            },
            (error) => {
                console.log(error);
                this.snackBar.open("UPI Payment failed", "Close", { duration: 3000 });
            }
        );
    }
    
    // Create Order
    createOrder(orderData: any) {
        this.commonService.post<any>(`${environment.orders.handleOrder}?action=add`, orderData).subscribe(
            response => {
                if (response && response.success === true) {
                    setTimeout(() => {
                        this.snackBar.open("Order placed successfully", "Close", {
                            verticalPosition: 'top',
                            horizontalPosition: 'right'
                        });
                        this.router.navigate([this.sessionID + '/payment-status'], { queryParams: { status: 'true' } });
                    }, 3500);
                } else {
                    this.snackBar.open("Order failed", "Close", {
                        verticalPosition: 'top',
                        horizontalPosition: 'right'
                    });
                }
            },
            error => {
                console.log(error);
                this.snackBar.open("Order failed", "Close", {
                    verticalPosition: 'top',
                    horizontalPosition: 'right'
                });
            }
        );
    }
}
