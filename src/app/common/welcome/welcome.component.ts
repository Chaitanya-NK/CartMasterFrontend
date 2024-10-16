import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonServiceService } from '../../services/common-service.service';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {

    token: string | null = localStorage.getItem('token')
    sessionID: string | null = localStorage.getItem('sessionID')

    constructor(
        private router: Router,
        private commonService: CommonServiceService
    ) {}

    getUsernameFromToken(): string | null {
        var username = this.commonService.getUserNameFromToken()
        return username
    }

    navigateToShop() {
        this.router.navigate([this.sessionID + '/user/categories'])
    }
}
