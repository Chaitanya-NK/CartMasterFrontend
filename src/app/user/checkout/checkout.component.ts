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

    constructor(
        private commonService: CommonServiceService,
        private fb: FormBuilder,
        private router: Router,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
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
        this.loadCartItems();
        this.loadAddress()
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
                if(response) {
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
                if(response.success === true) {
                    this.snackBar.open("Address Saved", "Close", {duration: 3000})
                    this.addressExists = true
                    this.editAddressMode = false
                    this.addressForm.get('address')?.disable()
                } else {
                    this.snackBar.open("Failed to Save Address", "Close", {duration: 3000})
                }
            }
        )
    }

    cancelEdit() {
        this.editAddressMode = false
        this.addressForm.get('address')?.disable()
    }

    placeOrder() {
        const dialogRef = this.dialog.open(PaymentUnderwayDialogComponent, {
            disableClose: true
        })

        setTimeout(() => {
            dialogRef.close()
        }, 3000);

        const token: any = localStorage.getItem('token')
        const decodedToken = JSON.parse(atob(token.split('.')[1]))
        const userID = decodedToken.UserID

        this.commonService.post<any>(`${environment.orders.handleOrder}?action=add&userId=${userID}&totalAmount=${this.finalAmount}`, null).subscribe(
            response => {
                if (response && response.success === true) {
                    setTimeout(() => {
                        this.snackBar.open("Order placed successfully", "Close", {
                            verticalPosition: 'top',
                            horizontalPosition: 'right'
                        })
                        this.router.navigate(['payment-status'], { queryParams: { status: 'true' } })
                    }, 3500);
                } else {
                    this.snackBar.open("Order failed", "Close", {
                        verticalPosition: 'top',
                        horizontalPosition: 'right'
                    })
                }
                // this.router.navigate(['/payment-status'], { queryParams: { status: 'true' } })

            },
            error => {
                console.log(error);
                // this.router.navigate(['/payment-status'], { queryParams: { status: 'false' } })
                this.snackBar.open("Order failed", "Close", {
                    verticalPosition: 'top',
                    horizontalPosition: 'right'
                })
            }
        )
    }
}
