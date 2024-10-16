import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProductImageDialogComponent } from '../product-image-dialog/product-image-dialog.component';
import { CommonServiceService } from '../../services/common-service.service';
import { Product } from '../../models/product';
import { environment } from 'src/environments/environment.development';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Category } from '../../models/category';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-admin-products',
    templateUrl: './admin-products.component.html',
    styleUrls: ['./admin-products.component.css']
})

export class AdminProductsComponent implements OnInit {

    addProductForm: FormGroup
    products: Product[] = []
    categories: Category[] = []
    selectedFileName: string | null = null
    previewUrl: string | ArrayBuffer | null = null
    displayedColumns: string[] = ["productName", "productDescription", "price", "stockQuantity", "image", "actions"]
    dataSource: MatTableDataSource<Product>
    expandedCategoryId: number | null = null
    categoryProducts: { [key: number]: any[] } = {}
    loading: boolean = true
    product: Product | null = null
    addEditProductLoading: boolean = false

    editingProduct: Product | null = null

    @ViewChild(MatPaginator) paginator!: MatPaginator

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private commonService: CommonServiceService,
        private snackBar: MatSnackBar,
        private spinnerService: NgxSpinnerService
    ) {
        this.addProductForm = this.fb.group({
            productName: ['', Validators.required],
            productDescription: ['', Validators.required],
            price: ['', Validators.required],
            stockQuantity: ['', Validators.required],
            imageUrl: [null, Validators.required],
            categoryId: ['', Validators.required]
        })
        this.dataSource = new MatTableDataSource<Product>(this.products)
    }

    ngOnInit(): void {
        this.spinnerService.show()

        setTimeout(() => {
            this.loadCategories()
            this.spinnerService.hide()
            this.loading = false;
        }, 1500);
    }

    loadCategories(): void {
        this.commonService.post<Category[]>(`${environment.categories.handleCategory}?action=getall`,null).subscribe(
            (response) => {
                this.categories = response
            },
            (error) => {
                console.error("Error loading categories", error);
            }
        )
    }

    onFileChange(event: any) {
        const file = event.target.files[0]
        if (file) {
            this.selectedFileName = file.name
            this.addProductForm.patchValue({ imageUrl: file })

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

    getProductsByCategory(categoryID: number) {
        if (this.categoryProducts[categoryID]) {
            return
        }

        this.commonService.post<any[]>(`${environment.products.handleProduct}?action=getbycategoryid&categoryId=${categoryID}`,null).subscribe(products => {
            this.categoryProducts[categoryID] = products
        })
    }

    onSave() {
        const productData = this.addProductForm.value;
        const formData = new FormData()

        formData.append('productName', productData.productName)
        formData.append('productDescription', productData.productDescription)
        formData.append('price', productData.price)
        formData.append('stockQuantity', productData.stockQuantity)
        formData.append('categoryId', productData.categoryId.categoryID)
        if(this.selectedFileName) {
            formData.append('imageURL', productData.imageUrl)
        }

        this.addEditProductLoading = true;

        const action = this.editingProduct ? 'update' : 'add';
        const requestBody = this.editingProduct
            ? { ...formData, productId: this.editingProduct.productID }
            : formData;

        this.commonService.post(`${environment.products.handleProduct}?action=${action}`, requestBody)
            .subscribe((response: any) => {
                if (response.success === true) {
                    this.snackBar.open(
                        this.editingProduct ? 'Product updated successfully' : 'Product added successfully',
                        'Close',
                        { duration: 3000 }
                    );
                    this.resetForm();
                    this.getProductsByCategory(productData.categoryId);
                } else {
                    this.snackBar.open(
                        this.editingProduct ? 'Product update failed' : 'Product addition failed',
                        'Close',
                        { duration: 3000 }
                    );
                }
                this.addEditProductLoading = false;
            });
    }

    editProduct(product: Product): void {
        this.editingProduct = product
        this.addProductForm.patchValue({
            productName: product.productName,
            productDescription: product.productDescription,
            price: product.price,
            stockQuantity: product.stockQuantity,
            imageUrl: product.imageURL,
            categoryId: product.categoryID,
        })
    }

    resetForm(): void {
        this.addProductForm.reset()
        this.editingProduct = null
    }

    deleteProduct(productID: number) {
        if (productID) {
            this.commonService.post(`${environment.products.handleProduct}?action=delete&productId=${productID}`, null)
            .subscribe((response: any) => {
                if (response.success === true) {
                    this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
                    this.getProductsByCategory(this.product?.categoryID!);
                } else {
                    this.snackBar.open('Product deletion failed', 'Close', { duration: 3000 });
                }
            });
        } else {
            this.snackBar.open('Product deletion failed', 'Close', { duration: 3000 });
        }
    }
}