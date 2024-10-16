import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonServiceService } from '../../services/common-service.service';
import { environment } from 'src/environments/environment.development';
import { UserOrder } from '../../models/user-order';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-admin-user-orders',
    templateUrl: './admin-user-orders.component.html',
    styleUrls: ['./admin-user-orders.component.css']
})
export class AdminUserOrdersComponent implements OnInit {

    // users: any[] = []
    // userOrders: { [key: number]: any[] } = {}
    // displayedColumns = ["orderDate", "status", "totalAmount", "orderItems"]
    statuses: string[] = ['Pending', 'Shipping', 'Out For Delivery', 'Delivered']
    // usersWithOrders: { userID: number, username: string, orders: UserOrder[] }[] =[]
    // filteredUsers: { userID: number, username: string, orders: UserOrder[] }[] =[]
    // filterStatus: string = ''

    @Input() orders: UserOrder[] = []
    @Output() statusChange = new EventEmitter<UserOrder>()

    // changeOrderStatus(order: UserOrder, newStatus: string): void {
    //     order.status = newStatus
    //     this.statusChange.emit(order)
    // }

    userId!: number
    userOrders: UserOrder[] = []
    loading: boolean = true

    constructor(
        private route: ActivatedRoute,
        private commonService: CommonServiceService,
        private snackBar: MatSnackBar,
        private cd: ChangeDetectorRef,
        private spinnerService: NgxSpinnerService
    ) { }

    ngOnInit(): void {
        this.spinnerService.show()
        setTimeout(() => {
            this.route.params.subscribe(params => {
                this.userId = +params['id']
                this.fetchUserOrders()
            })
            this.spinnerService.hide()
            this.loading = false
        }, 2000);
    }

    fetchUserOrders(): void {
        this.commonService.post<any[]>(`${environment.orders.handleOrder}?action=getbyuserid&userId=${this.userId}`, null).subscribe(
            (orders: UserOrder[]) => {
                this.userOrders = orders
                console.log((orders));
            },
            error => {
                console.error(error);
            }
        )
    }

    changeOrderStatus(orderId: number, newStatus: string): void {
        this.commonService.post(`${environment.orders.handleOrder}?action=updateorderstatus&orderId=${orderId}&status=${newStatus}`, null).subscribe(
            (response: any) => {
                if(response.success === true) {
                    this.snackBar.open(`Order Status changed to ${newStatus} successfully`, "Close", {duration: 3000})
                    this.fetchUserOrders()
                } else {
                    this.snackBar.open(`Order Status change failed`, "Close", {duration: 3000})
                    this.fetchUserOrders()
                }
            } 
        )
    }

    processReturnRequest(item: any, newStatus: string): void {
        this.commonService.post(`${environment.orders.handleOrder}?action=processreturn&orderItemId=${item.orderItemID}&returnStatus=${newStatus}`, null).subscribe(
            (response: any) => {
                if(response.success) {
                    this.snackBar.open("Return request accepted", "Close", { duration: 3000 })
                    item.returnStatus = newStatus
                    // this.fetchUserOrders()
                    this.cd.detectChanges()
                } else {
                    this.snackBar.open("Failed to accept return request", "Close", {duration: 3000})
                }
                this.fetchUserOrders()
            },
            error => {
                this.snackBar.open("Error occurred while accepting return request", "Close", {duration: 3000})
            }
        )
    }
}