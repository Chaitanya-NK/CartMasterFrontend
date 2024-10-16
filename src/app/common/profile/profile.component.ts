import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../../services/common-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment.development';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    profileForm: FormGroup
    userID: number = 0
    username: string = ''
    isEditing: boolean = false
    hidePassword = true;
    loading: boolean = true

    constructor(
        private fb: FormBuilder,
        private commonService: CommonServiceService,
        private snackBar: MatSnackBar,
        private spinnerService: NgxSpinnerService
    ) {
        this.profileForm = this.fb.group({
            username: [{ value: '', disabled: true }, Validators.required],
            firstName: [{value :'', disabled: true}, Validators.required],
            lastName: [{value :'', disabled: true}, Validators.required],
            email: [{value :'', disabled: true}, [Validators.required, Validators.email]],
            password: [{value :'', disabled: true}, [Validators.required, Validators.minLength(6)]],
            address: [{value :'', disabled: true}, Validators.required],
            phoneNumber: [{value :'', disabled: true}, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        })
    }

    ngOnInit(): void {
        this.spinnerService.show()

        this.userID = this.getUserIdFromToken()
        this.username = this.getUserNameFromToken()
        setTimeout(() => {
            this.loading = false
            this.spinnerService.hide()
            this.loadUserProfile()
        }, 2000)
    }

    getUserIdFromToken(): number {
        const token = localStorage.getItem('token')
        if(token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]))
            return decodedToken.UserID
        }
        return 0
    }

    getUserNameFromToken(): string {
        const token = localStorage.getItem('token')
        if(token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]))
            return decodedToken.Username
        }
        return ''
    }

    loadUserProfile(): void {
        if(this.userID) {
            this.commonService.getById<any>(environment.users.getById, {userId: this.userID}).subscribe(
                user => {
                    this.profileForm.patchValue(user)
                },
                error => {
                    console.error("Error fetching user profile: ", error);
                    
                }
            )
        }
    }

    onEdit(): void {
        this.isEditing = !this.isEditing
        if(!this.isEditing) {
            this.profileForm.disable()
        } else {
            this.profileForm.enable()
        }
    }

    onSave(): void {
        const formData = this.profileForm.value

        this.commonService.put(environment.users.update, formData).subscribe(
            (response: any) => {
                if(response.success == true) {
                    this.snackBar.open("User Details updated successfully", "Close", { duration: 2000 })
                } else {
                    this.snackBar.open("User Details update failed", "Close", { duration: 2000 })
                }
            },
            error => {
                this.snackBar.open("User Details update failed", "Close", { duration: 2000 })
            }
        )
        
    }
}
