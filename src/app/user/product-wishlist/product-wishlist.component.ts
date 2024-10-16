import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../../services/common-service.service';
import { environment } from 'src/environments/environment.development';
import { Wishlist } from '../../models/wishlist';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-product-wishlist',
    templateUrl: './product-wishlist.component.html',
    styleUrls: ['./product-wishlist.component.css']
})
export class ProductWishlistComponent implements OnInit {

    wishlistItems: Wishlist[] = []
    token: any = localStorage.getItem('token')
    decodedToken = JSON.parse(atob(this.token.split('.')[1]))
    userID = this.decodedToken.UserID
    loading: boolean = true

    private readonly notifier: NotifierService;

    constructor(
        private commonService: CommonServiceService,
        private snackBar: MatSnackBar,
        private notifireService: NotifierService,
        private spinnerService: NgxSpinnerService
    ) {
        this.notifier = notifireService
     }

    ngOnInit(): void {
        this.spinnerService.show()

        setTimeout(() => {
            this.loadWishlist()
            this.spinnerService.hide()
            this.loading = false
        }, 1000)
    }

    loadWishlist(): void {
        this.commonService.post<Wishlist[]>(`${environment.wishlsit.handleWishlist}?action=getbyid&userId=${this.userID}`, null)
            .subscribe((data: Wishlist[]) => {
                this.wishlistItems = data
            })
    }

    removeFromWishlist(userId: number, productId: number): void {
        this.commonService.post(`${environment.wishlsit.handleWishlist}?action=delete&userId=${userId}&productId=${productId}`, null).subscribe(
            (response: any) => {
                if (response.success === true) {
                    this.snackBar.open("Product removed from wishlist", "Close", { duration: 3000 })
                    this.loadWishlist()
                } else {
                    this.snackBar.open("Product failed to remove from wishlist", "Close", { duration: 3000 })
                    this.loadWishlist()
                }
            }
        )
    }
}