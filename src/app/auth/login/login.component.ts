import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../../models/login';
import { CommonServiceService } from '../../services/common-service.service';
import { Router } from '@angular/router';
import { Menu } from '../../models/menu';
import { Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    hidePassword = true;
    hideConfirmPassword = true;
    loginForm: FormGroup
    captchaResolved: boolean = false
    captchaToken: string | null = null
    siteKey: string = '6LeCklUqAAAAAKG7ef3LQYS8ijoIz-W_cbFzG3ZE'

    credentials: Login = {
        username: '',
        password: ''
    }
    sesseionID: any;

    constructor(
        private commonService: CommonServiceService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        })
    }

    navigateToRegister() {
        this.router.navigate(['register'])
    }

    onCaptchaResolved(captchaResponse: string | null): void {
        if (captchaResponse) {
            this.captchaResolved = true
            this.captchaToken = captchaResponse
        } else {
            this.captchaResolved = false
            this.captchaToken = null
        }
    }

    login() {
        if (this.loginForm.valid && this.captchaResolved) {
            const loginData = this.loginForm.value
            loginData.captchaToken = this.captchaToken
            this.commonService.login(loginData).pipe(
                switchMap(response => {
                    localStorage.setItem('token', response.token)
                    const roleID: any = this.commonService.getRoleFromToken();
                    return this.commonService.getMenusByRole(roleID)
                }),
                switchMap((menus: Menu[]) => {
                    this.commonService.setMenus(menus)
                    return this.userSession()
                })
            ).subscribe({
                next: (sessionID: string) => {
                    this.router.navigate(['/'])
                },
                error: err => {
                    console.error("Error ", err);

                }
            })
        }
    }

    userSession(): Observable<string> {
        const userID: any = this.commonService.getUserIdFromToken();
        return this.commonService.post(`${environment.userSession.handleUserSession}?action=add&userID=${userID}`, {}).pipe(
            switchMap((response: any) => {
                if(response.success === true) {
                    localStorage.setItem('sessionID', response.sessionID as string)
                    return response.sessionID as string
                } else {
                    throw new Error('Session creation failed')
                }
            })
        )
    }

    decodedToken(token: string) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]))
        return decodedToken
    }

    navigateToForgotPassword() {
        this.router.navigate(['/forgot-password'])
    }
}