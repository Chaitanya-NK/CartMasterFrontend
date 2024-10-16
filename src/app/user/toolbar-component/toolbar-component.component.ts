import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '../../services/common-service.service';
import { Menu } from '../../models/menu';
import { environment } from 'src/environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-toolbar-component',
    templateUrl: './toolbar-component.component.html',
    styleUrls: ['./toolbar-component.component.css']
})
export class ToolbarComponentComponent implements OnInit {
    
    menus: Menu[] = []
    isLoggedIn: boolean = false
    cartItemCount: number = 0
    isSmallScreen: boolean = false; // Flag to detect screen size
    sessionID: string | null = localStorage.getItem('sessionID')

    constructor(
        private router: Router, 
        private commonService: CommonServiceService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        const roleID = this.commonService.getRoleFromToken();
        if (roleID) {
            this.isLoggedIn = true
            this.commonService.getMenusByRole(roleID).subscribe((menus: Menu[]) => {
                this.menus = menus
            })
        }
        this.getCartItemCount()
    }

    roleName(): boolean {
        var roleName = this.commonService.getRoleNameFromToken()
        if (roleName === "ADMIN") {
            return true
        }
        return false
    }

    userName() {
        var userName = this.commonService.getUserNameFromToken()
        return userName
    }

    navigateToLogin() {
        this.router.navigate(['/login'])
    }

    navigateToRegister() {
        this.router.navigate(['/register'])
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.checkScreenSize();
    }

    checkScreenSize() {
        this.isSmallScreen = window.innerWidth <= 768; // Small screen if width <= 768px
    }

    onMenuClick(route: string) {
        this.router.navigate([this.sessionID + route])
    }

    async onLogout() {
        localStorage.clear()
        // window.location.reload()
        await this.userSession()
        this.router.navigate(['/'])
    }

    async userSession() {
        this.commonService.post(`${environment.userSession.handleUserSession}?action=update&sessionID=${this.sessionID}`, null).subscribe(
            (response: any) => {
                if(response.success = true) {
                    this.snackBar.open("Session closed", "Close", { duration: 2000 })
                }
            }
        )
    }

    navigateToProfile() {
        this.router.navigate([this.sessionID + '/profile'])
    }

    navigateToWishlist() {
        this.router.navigate([this.sessionID + '/wishlist'])
    }

    navigateToCart() {
        this.router.navigate([this.sessionID + '/cart'])
    }

    navigateToOrders() {
        this.router.navigate([this.sessionID + '/user/orders'])
    }

    getCartItemCount() {
        const token: any = localStorage.getItem('token')
        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]))
            const cartID = decodedToken.CartID
            this.commonService.getById<any>(environment.cart.getCartItemCountByCartId, { cartId: cartID }).subscribe(count => {
                this.cartItemCount = count
            })
        }
    }
}
