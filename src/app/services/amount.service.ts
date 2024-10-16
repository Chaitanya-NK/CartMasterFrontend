import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AmountService {

    private finalAmountSource = new BehaviorSubject<number>(0);
    private discountAmountSource = new BehaviorSubject<number>(0);
    private discountedFinalAmountSource = new BehaviorSubject<number>(0);

    finalAmount$ = this.finalAmountSource.asObservable();
    discountAmount$ = this.discountAmountSource.asObservable();
    discountedFinalAmount$ = this.discountedFinalAmountSource.asObservable();

    setFinalAmount(amount: number) {
        this.finalAmountSource.next(amount)
    }

    setDiscountAmount(amount: number) {
        this.discountAmountSource.next(amount)
    }

    setDiscountedFinalAmount(amount: number) {
        this.discountedFinalAmountSource.next(amount)
    }
}
