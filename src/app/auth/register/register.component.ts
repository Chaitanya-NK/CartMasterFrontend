import { Component } from '@angular/core';
import { Register } from '../../models/register';
import { CommonServiceService } from '../../services/common-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {

    hidePassword = true;
    hideConfirmPassword = true;
    message: string | null = null;
    registerForm: FormGroup

    user: Register = {
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        phonenumber: '',
        email: ''
    }

    constructor(
        private commonService: CommonServiceService, 
        private router: Router,
        private fb: FormBuilder
    ) {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmpassword: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            phonenumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
        })
    }

    navigateToLogin() {
        this.router.navigate(['login'])
    }

    register() {
        this.user.firstname = this.registerForm.value.firstname
        this.user.lastname = this.registerForm.value.lastname
        this.user.username = this.registerForm.value.username
        this.user.password = this.registerForm.value.password
        this.user.phonenumber = this.registerForm.value.phonenumber
        this.user.email = this.registerForm.value.email
        
        this.commonService.register(this.user).subscribe((response: any) => {
            if(response.userId) {
                sessionStorage.setItem("UserID", response.userId)
                this.router.navigate(['verify-otp'])
            }
        })
        console.log('user', this.user)
    }
}
