import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Category } from 'src/app/models/category';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

    categories: Category[] = [];
    loading: boolean = true;
    sessionID: string | null = localStorage.getItem('sessionID')
    placeholders = Array(3);

    constructor(
        private commonService: CommonServiceService,
        private spinnerService: NgxSpinnerService,
        private dialog: MatDialog,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.spinnerService.show()

        setTimeout(() => {
            this.getCategories();
            this.spinnerService.hide()
            this.loading = false;
        }, 2000);
    }

    getCategories(): void {
        this.spinnerService.show()
        this.commonService.post<Category[]>(`${environment.categories.handleCategory}?action=getall`,null).subscribe(
            (response: Category[]) => {
                this.categories = response;
                this.spinnerService.hide()
            },
            (error) => {
                console.error('Error while retrieving categories', error);
            }
        );
    }

    navigateToCategoryProduct(categoryID: number) {
        this.router.navigate([this.sessionID + '/user/products/category/', categoryID]);
    }
}
