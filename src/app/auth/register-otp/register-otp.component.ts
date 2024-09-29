import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-register-otp',
    templateUrl: './register-otp.component.html',
    styleUrls: ['./register-otp.component.css']
})
export class RegisterOtpComponent {

    otp: string[] = new Array(6).fill('')

    constructor(
        private commonService: CommonServiceService,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    get isButtonDisabled(): boolean {
        return this.otp.some(digit => digit === '')
    }

    onKeyUp(event: any, index: number){
        if(event.key === 'Backspace' && index > 0) {
            this.otp[index] = '';
            (document.querySelectorAll('input')[index-1] as HTMLElement).focus()
        } else if(event.key >= '0' && event.key <= '9' && index < 5) {
            (document.querySelectorAll('input')[index+1] as HTMLElement).focus()
        }
    }

    verifyOTP() {
        const otpCode = this.otp.join('')
        const userId = sessionStorage.getItem("UserID")
        if(!userId) {
            this.snackBar.open("No user found for otp verification.", "Close", {duration: 3000})
        }
        this.commonService.post(environment.users.verifyOTP, { userId: userId, OTPCode: otpCode }).subscribe(
            (resposne: any) => {
                if(resposne.success === true) {
                    this.snackBar.open("OTP Verified! Account Created.", "Close", { duration: 3000 })
                    this.router.navigate(['login']).then(() => {
                        sessionStorage.removeItem("UserID");
                    })
                } else {
                    this.snackBar.open("Failed to verify OTP! Account Not Created.", "Close", { duration: 3000 })
                }
            },
            error => {
                this.snackBar.open("Failed to verify OTP! Account Not Created.", "Close", { duration: 3000 })
            }
        )
    }
}
