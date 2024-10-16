import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    hidePassword = true;
    hideConfirmPassword = true
    newPassword: string = ''
    confirmPassword: string = ''
    token: string = ''

    constructor(
        private route: ActivatedRoute,
        private commonService: CommonServiceService,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParams['token']
    }

    onSubmit() {
        if(this.newPassword !== this.confirmPassword) {
            this.snackBar.open("Passwords do not match!", "Close", { duration: 3000 })
            return
        }

        this.commonService.resetPassword(this.token, this.newPassword).subscribe(
            () => {
                this.snackBar.open("Password reset successfully", "Close", { duration: 3000 })
                this.router.navigate(['/login'])
            },
            (error) => {
                this.snackBar.open("Failed to reset password. Try again later.", "Close", { duration: 3000 })
            }
        )
    }
}