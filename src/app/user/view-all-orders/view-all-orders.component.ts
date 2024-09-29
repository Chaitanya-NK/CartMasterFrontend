import { Component, OnInit } from '@angular/core';
import { OrderItem, UserOrder } from '../../models/user-order';
import { CommonServiceService } from '../../services/common-service.service';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderCancelDialogComponent } from '../order-cancel-dialog/order-cancel-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ReturnConfirmationDialogComponent } from '../return-confirmation-dialog/return-confirmation-dialog.component';
import { RequestReturnSpinnerDialogComponent } from '../request-return-spinner-dialog/request-return-spinner-dialog.component';

@Component({
    selector: 'app-view-all-orders',
    templateUrl: './view-all-orders.component.html',
    styleUrls: ['./view-all-orders.component.css']
})
export class ViewAllOrdersComponent implements OnInit {

    orders: UserOrder[] = []
    orderItems: OrderItem[] = []
    displayedColumns: string[] = ['imageURL', 'productName', 'productDescription', 'quantity', 'price']
    loading: boolean = true
    cancelOrderDisable: string[] = ['Cancelled', 'Delivered', 'Out For Delivery']
    returnOrderStatus: string[] = ['None', 'Return Requested', 'Returned']

    constructor(
        private commonService: CommonServiceService,
        private router: Router,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.loadOrders()
            this.loading = false
        }, 1000)
    }

    loadOrders() {
        const userID = this.commonService.getUserIdFromToken()
        this.commonService.post<any[]>(`${environment.orders.handleOrder}?action=getbyuserid&userId=${userID}`, null).subscribe(
            orders => {
                this.orders = orders
                this.orders.forEach(order => {
                    if(order.status === 'Delivered') {
                        if(!this.displayedColumns.includes('return')) {
                            this.displayedColumns.push('return')
                        }
                    }
                })
            }
        )
    }

    canCancelOrder(status: string): boolean {
        return !this.cancelOrderDisable.includes(status)
    }

    isReturnRequested(orderItems: OrderItem[]) : boolean {
        return orderItems.some(item => item.returnRequested === true)
    }

    canDisplayActionButtons(orderItems: OrderItem[]): boolean {
        return orderItems.some(item => !item.returnRequested)
    }

    cancelOrder(orderId: number) {
        const dialogRef = this.dialog.open(OrderCancelDialogComponent, {
            disableClose: true
        })

        setTimeout(() => {
            dialogRef.close()
        }, 3000);

        this.commonService.post(`${environment.orders.handleOrder}?action=cancelorder&orderId=${orderId}`, null).subscribe(
            (response: any) => {
                if(response.success === true) {
                    setTimeout(() => {
                        this.snackBar.open("Order cancelled successfully", "Close", {duration: 3000})
                        this.loadOrders()
                    }, 3500);
                } else {
                    this.snackBar.open("Failed to cancel order", "Close", {duration: 3000})
                    this.loadOrders()
                }
            }
        )
    }

    nagivateToTrackOrder(orderID: number) {
        this.router.navigate(['/user/order/track-order', orderID])
    }

    requestReturn(item: OrderItem) {
        const dialogRef = this.dialog.open(ReturnConfirmationDialogComponent)

        dialogRef.afterClosed().subscribe(result => {
            if(result) {
                const spinnerDialogRef = this.dialog.open(RequestReturnSpinnerDialogComponent, {
                    disableClose: true,
                    width: '300px'
                })
                setTimeout(() => {
                    this.commonService.post(`${environment.orders.handleOrder}?action=requestreturn&orderItemId=${item.orderItemID}`, null).subscribe(
                        (response: any) => {
                            spinnerDialogRef.close()
                            if(response.success) {
                                this.snackBar.open("Return requested successfully", "Close", {
                                    duration: 3000
                                })
                                item.returnRequested = true
                                this.loadOrders()
                            } else {
                                this.snackBar.open("Return request failed", "Close", {
                                    duration: 3000
                                })
                            }
                        },
                        (error) => {
                            spinnerDialogRef.close()
                            this.snackBar.open("Return request failed", "Close", {
                                duration: 3000
                            })
                        }
                    )
                }, 3000);
            }
        })
    }
}