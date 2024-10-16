import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {

    contactForm: FormGroup;
    fromEmail!: string; // This will hold the email fetched from the token

    constructor(
        private fb: FormBuilder,
        private commonService: CommonServiceService,
        private snackBar: MatSnackBar
    ) {
        this.contactForm = this.fb.group({
            fromEmail: ['', Validators.required],
            subject: ['', Validators.required],
            body: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        // Fetch the email from token and assign to fromEmail
        this.fromEmail = this.commonService.getEmailFromToken() // Implement this method based on your authentication logic
        this.contactForm.get('fromEmail')?.setValue(this.fromEmail);
    }

    onSubmit(): void {
        if (this.contactForm.valid) {
            const formData = this.contactForm.value;
            console.log('Form submitted:', formData);
            // Call your email sending service here
            // this.commonService.post(`${environment.email.sendEmail}?fromEmail=${formData.fromEmail}&subject=${formData.subject}&body=${formData.body}`, null).subscribe(
            //     (response: any) => {
            //         this.snackBar.open("Email sent successfully", "Close", { duration: 3000 })
            //     },
            //     error => {
            //         this.snackBar.open("Email failed.", "Close", { duration: 3000 })
            //     }
            // )
        }
    }
}
