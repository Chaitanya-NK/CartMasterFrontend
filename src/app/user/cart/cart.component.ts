import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/cart-item';
import { CommonServiceService } from '../../services/common-service.service';
import { environment } from 'src/environments/environment.development';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

    displayedColumns: string[] = ['image', 'productname', 'quantity', 'price', 'actions']
    dataSource = new MatTableDataSource<any>(this.cartItems)

    constructor(
        private commonService: CommonServiceService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.loadCartItems()
            this.loading = false
        }, 1000)
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
    }

    removeFromCart(cartID: number, productId: number) {
        this.commonService.post(`${environment.cart.handleCart}?action=delete&cartId=${cartID}&productId=${productId}`, null).subscribe(
            (response: any) => {
                if(response.success === true) {
                    this.snackBar.open("Item removed from cart successfully", "Close", {duration: 3000})
                    this.loadCartItems()
                } else {
                    this.snackBar.open("Item failed to remove from cart", "Close", {duration: 3000})
                    this.loadCartItems()
                }
            }
        )
    }

    proceedToOrder() {
        this.router.navigate(['/checkout'])
    }
}
