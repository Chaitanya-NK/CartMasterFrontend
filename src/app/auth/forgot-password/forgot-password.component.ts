import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

    forgotPasswordForm: FormGroup

    constructor(
        private commonService: CommonServiceService, 
        private snackbar: MatSnackBar,
        private fb: FormBuilder,
        private router: Router
    ) { 
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        })
    }

    ngOnInit(): void {
        
    }

    onSubmit() {
        if(this.forgotPasswordForm.valid) {
            const email = this.forgotPasswordForm.value.email
            console.log(email);
                 
            this.commonService.requestPasswordReset(email).subscribe(
                (response) => {   
                    console.log(response);
                                 
                    this.snackbar.open(`Password reset link sent to ${email}`, "Close", {duration: 3000})
                },
                error => {
                    console.error(error);
                    
                    this.snackbar.open("Failed to send reset link. Try again later.", "Close", {duration: 3000})
                }
            )
        }
    }

    navigateToLogin() {
        this.router.navigate(['/login'])
    }
}
