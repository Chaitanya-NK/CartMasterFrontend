import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../../services/common-service.service';
import { environment } from 'src/environments/environment.development';
import { Category } from '../../models/category';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductImageDialogComponent } from '../product-image-dialog/product-image-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-admin-category',
    templateUrl: './admin-category.component.html',
    styleUrls: ['./admin-category.component.css']
})
export class AdminCategoryComponent implements OnInit {
    
    addCategoryForm: FormGroup;
    categories: Category[] = [];
    selectedFileName: string | null = null
    previewUrl: string | ArrayBuffer | null = null
    displayedColumns: string[] = ["image", "categoryName", "edit"];
    dataSource: MatTableDataSource<Category>;
    loading: boolean = true;
    rowCount = 2;
    columnCount = 2;
    addEditCategoryLoading: boolean = false

    editingCategory: Category | null = null; // Holds the category being edited

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private commonService: CommonServiceService,
        private spinnerService: NgxSpinnerService,
        private dialog: MatDialog
    ) {
        this.addCategoryForm = this.fb.group({
            categoryName: ['', Validators.required],
            imageUrl: [null, Validators.required]
        });
        this.dataSource = new MatTableDataSource<Category>(this.categories);
    }

    // ngAfterViewInit() {
    //     this.dataSource.sort = this.sort
    // }

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
                this.dataSource = new MatTableDataSource<Category>(this.categories);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort
                this.spinnerService.hide()
            },
            (error) => {
                console.error('Error while retrieving categories', error);
            }
        );
    }

    onFileChange(event: any) {
        const file = event.target.files[0]
        if (file) {
            this.selectedFileName = file.name
            this.addCategoryForm.patchValue({ imageUrl: file })

            const reader = new FileReader()
            reader.onload = () => {
                this.previewUrl = reader.result
            }
            reader.readAsDataURL(file)
        }
    }

    openImageDialog() {
        if (this.previewUrl) {
            this.dialog.open(ProductImageDialogComponent, {
                data: { imageUrl: this.previewUrl },
                width: '80%'
            })
        }
    }

    // Triggered when the form is submitted (add/edit)
    onSubmit() {
        const categoryData = this.addCategoryForm.value;
        const formData = new FormData()
        
        formData.append('categoryName', categoryData.categoryName)
        if(this.selectedFileName) {
            formData.append('imageURL', categoryData.imageUrl)
        }

        this.addEditCategoryLoading = true
        
        const action = this.editingCategory ? 'update' : 'add'
        const requestBody = this.editingCategory
            ? { ...formData, categoryId: this.editingCategory.categoryID }
            : formData
        
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
            categoryName: category.categoryName,
            imageURL: category.imageURL
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