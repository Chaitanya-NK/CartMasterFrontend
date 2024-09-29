import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../../services/common-service.service';
import { environment } from 'src/environments/environment.development';
import { Category } from '../../models/category';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-admin-category',
    templateUrl: './admin-category.component.html',
    styleUrls: ['./admin-category.component.css']
})
export class AdminCategoryComponent implements OnInit {
    
    addCategoryForm: FormGroup;
    categories: Category[] = [];
    displayedColumns: string[] = ["categoryName", "edit"];
    dataSource: MatTableDataSource<Category>;
    loading: boolean = true;
    rowCount = 2;
    columnCount = 2;
    addEditCategoryLoading: boolean = false

    editingCategory: Category | null = null; // Holds the category being edited

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private commonService: CommonServiceService
    ) {
        this.addCategoryForm = this.fb.group({
            categoryName: ['', Validators.required]
        });
        this.dataSource = new MatTableDataSource<Category>(this.categories);
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.getCategories();
            this.loading = false;
        }, 1000);
    }

    getCategories(): void {
        this.commonService.post<Category[]>(`${environment.categories.handleCategory}?action=getall`,null).subscribe(
            (response: Category[]) => {
                this.categories = response;
                this.dataSource = new MatTableDataSource<Category>(this.categories);
                this.dataSource.paginator = this.paginator;
            },
            (error) => {
                console.error('Error while retrieving categories', error);
            }
        );
    }

    // Triggered when the form is submitted (add/edit)
    onSubmit(): void {
        const categoryData = this.addCategoryForm.value;
        this.addEditCategoryLoading = true

        const action = this.editingCategory ? 'update' : 'add'
        const requestBody = this.editingCategory
            ? { ...categoryData, categoryId: this.editingCategory.categoryID }
            : categoryData
        
        this.commonService.post(`${environment.categories.handleCategory}?action=${action}`, requestBody)
            .subscribe((response: any) => {
                if(response.success === true) {
                    this.snackBar.open(
                        this.editingCategory ? 'Category updated successfully' : 'Category added successfully',
                        "Close",
                        { duration: 3000 }
                    )
                    this.resetForm()
                    this.getCategories()
                } else {
                    this.snackBar.open(
                        this.editingCategory ? 'Category update failed' : 'Category addition failed',
                        'Close',
                        { duration: 3000 }
                    );
                }
                this.addEditCategoryLoading = false
            })
    }

    // Triggered when clicking the edit icon
    editCategory(category: Category): void {
        this.editingCategory = category; // Set the category being edited
        this.addCategoryForm.patchValue({
            categoryName: category.categoryName
        });
    }

    // Reset form after adding or editing
    resetForm(): void {
        this.addCategoryForm.reset();
        this.editingCategory = null; // Clear edit mode
    }

    deleteCategory(categoryID: number) {
        if(categoryID) {
            this.commonService.post(`${environment.categories.handleCategory}?action=delete&categoryId=${categoryID}`, null).subscribe(
                (response: any) => {
                    if(response.success === true) {
                        this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
                        this.getCategories();
                    }
                    else {
                        this.snackBar.open('Category deletion failed', 'Close', { duration: 3000 });
                        this.getCategories();
                    }
                }
            )
        }
        else {
            this.snackBar.open('Category deletion failed', 'Close', { duration: 3000 });
            this.getCategories();
        }
    }
}