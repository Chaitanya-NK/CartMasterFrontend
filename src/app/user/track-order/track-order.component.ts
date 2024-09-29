import { Component, OnInit } from '@angular/core';
import { UserOrder } from '../../models/user-order';
import { ActivatedRoute } from '@angular/router';
import { CommonServiceService } from '../../services/common-service.service';
import { environment } from 'src/environments/environment.development';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OrderCancelDialogComponent } from '../order-cancel-dialog/order-cancel-dialog.component';

@Component({
    selector: 'app-track-order',
    templateUrl: './track-order.component.html',
    styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit {

    orders: UserOrder[] = []
    deliveryStatus: string[] = ['Pending', 'Shipping', 'Out For Delivery', 'Delivered']
    currentStatusIndex: number = 0
    displayedColumns: string[] = ['imageURL', 'productName', 'productDescription', 'quantity', 'price']
    dataSource: MatTableDataSource<UserOrder>
    cancelOrderDisable: string[] = ['Cancelled', 'Delivered', 'Out For Delivery']
    isDownloading: boolean = false

    constructor(
        private route: ActivatedRoute,
        private commonService: CommonServiceService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) { 
        this.dataSource = new MatTableDataSource<UserOrder>
    }

    ngOnInit(): void {
        const orderID = +this.route.snapshot.paramMap.get('id')!
        this.loadOrderDetails(orderID)
    }

    loadOrderDetails(orderID: number): void {
        this.commonService.post<any>(`${environment.orders.handleOrder}?action=getbyorderid&orderId=${orderID}`, null).subscribe(
            order => {
                this.orders = [order]
                this.currentStatusIndex = this.deliveryStatus.indexOf(order.status)
                this.dataSource.data = order.orderItems
            }
        )
    }

    canCancelOrder(status: string): boolean {
        return !this.cancelOrderDisable.includes(status)
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
                        this.loadOrderDetails(orderId)
                    }, 3500);
                } else {
                    this.snackBar.open("Failed to cancel order", "Close", {duration: 3000})
                    this.loadOrderDetails(orderId)
                }
            }
        )
    }

    downloadInvoice(orderId: number): void {
        this.isDownloading = true
        this.commonService.downloadFile(environment.orders.getInvoiceByOrderId, {orderId: orderId}).subscribe((response: Blob) => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Invoice_Order_${orderId}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
            this.snackBar.open("Invoice Downloaded", "Close", { duration: 3000 });
            this.isDownloading = false
        }, (error) => {
            this.snackBar.open("Failed to download invoice", "Close", { duration: 3000 });
            this.isDownloading = false
        });
    }
}
