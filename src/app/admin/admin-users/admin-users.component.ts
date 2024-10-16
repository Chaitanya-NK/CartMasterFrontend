import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonServiceService } from '../../services/common-service.service';
import { environment } from 'src/environments/environment.development';
import { UserOrder } from '../../models/user-order';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-admin-users',
    templateUrl: './admin-users.component.html',
    styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
    users: User[] = []
    // userOrders: { [key: number]: any[] } = {}
    displayedColumns: string[] = ["username", "email", "firstName", "lastName", "phoneNumber", "viewOrders"]
    dataSource: MatTableDataSource<User>
    // selectedUserOrders: UserOrder[] = []
    loading: boolean = true
    columnCount = 7
    rowCount = 5

    sessionID: string | null = localStorage.getItem('sessionID')

    @ViewChild(MatPaginator) paginator!: MatPaginator

    constructor(
        private commonService: CommonServiceService,
        private router: Router,
        private spinnserService: NgxSpinnerService
    ) {
        this.dataSource = new MatTableDataSource<User>()
    }

    ngOnInit(): void {
        this.spinnserService.show()

        setTimeout(() => {
            this.spinnserService.hide()
            this.loading = false
            this.getUsers()
        }, 1500);
    }

    getUsers(): void {
        this.commonService.get<User[]>(environment.users.get).subscribe(
            (response: User[]) => {
                this.users = response
                this.dataSource = new MatTableDataSource<User>(this.users)
                this.dataSource.paginator = this.paginator
            },
            (error) => {
                console.error('Error while retrieving the users', error);
            }
        )
    }

    viewOrders(userID: number): void {
        this.router.navigate([this.sessionID + '/admin/userOrders', userID])
    }
}