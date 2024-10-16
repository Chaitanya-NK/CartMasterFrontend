import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

    constructor(private spinner: NgxSpinnerService) { }

    showSpinnerWithTimer() {
        this.spinner.show()

        setTimeout(() => {
            this.spinner.hide()
        }, 3000)
    }
}
