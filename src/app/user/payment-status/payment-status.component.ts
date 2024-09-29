import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-payment-status',
    templateUrl: './payment-status.component.html',
    styleUrls: ['./payment-status.component.css']
})
export class PaymentStatusComponent implements OnInit {

    isPaymentSuccessful: boolean | null = null

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.isPaymentSuccessful = params['status'] === 'true'
        })
    }
}
