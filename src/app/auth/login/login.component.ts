import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../../models/login';
import { CommonServiceService } from '../../services/common-service.service';
import { Router } from '@angular/router';
import { Menu } from '../../models/menu';
import { switchMap } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    hidePassword = true;
    hideConfirmPassword = true;
    loginForm: FormGroup

    credentials: Login = {
        username: '',
        password: ''
    }

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

    login() {
        this.credentials.username = this.loginForm.value.username
        this.credentials.password = this.loginForm.value.password

        this.commonService.login(this.credentials).pipe(
            switchMap(response => {
                localStorage.setItem('token', response.token)
                const roleID: any = this.commonService.getRoleFromToken();
                return this.commonService.getMenusByRole(roleID)
            })
        ).subscribe({
            next: (menus: Menu[]) => {
                this.commonService.setMenus(menus)
                this.router.navigate(['/'])
            },
            error: err => {
                console.error("Error ", err);
                
            }
        })
    }

    decodedToken(token: string) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]))
        return decodedToken
    }
}