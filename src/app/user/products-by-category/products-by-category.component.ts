import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Product } from 'src/app/models/product';
import { Wishlist } from 'src/app/models/wishlist';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-products-by-category',
    templateUrl: './products-by-category.component.html',
    styleUrls: ['./products-by-category.component.css']
})
export class ProductsByCategoryComponent implements OnInit {

    products: Product[] = [];
    filteredProducts: Product[] = [];
    paginatedProducts: Product[] = [];
    priceRanges: string[] = ['0-500', '501-1000', '1001-5000', '5000+'];
    selectedPriceRange: string | null = null;
    searchTerm: string = '';
    sortType: string = '';
    loading: boolean = true;
    placeholders = Array(3);
    categoryID: number = 0

    pageSize: number = 6;  // Number of items per page
    currentPage: number = 0;  // Track current page
    totalProducts: number = 0;  // Total number of products

    sessionID: string | null = localStorage.getItem('sessionID')

    constructor(
        private commonService: CommonServiceService,
        private router: Router,
        private snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private spinnerService: NgxSpinnerService
    ) { }

    ngOnInit(): void {
        this.spinnerService.show()
        this.route.params.subscribe(params => {
            this.categoryID = +params['id']
        })

        setTimeout(() => {
            this.route.paramMap.subscribe(params => {
                const categoryID = +params.get('id')!
                this.getProductsByCategory(categoryID)
                this.loadAverageRating(categoryID)
            })
            this.spinnerService.hide()
            this.loading = false;
        }, 2000);
    }

    loadAverageRating(productID: number): void {
        this.commonService.getById<number>(environment.reviews.getAverageRating, { productId: productID }).subscribe(
            rating => {
                const product = this.products.find(p => p.productID === productID)
                if (product) {
                    product.averageRating = rating
                    product.hasReviews = true
                }
            },
            error => {
                console.error('Error loading average rating', error);
            }
        );
    }

    loadAverageRatings(): void {
        this.products.forEach(product => {
            if (product.hasReviews) {
                this.loadAverageRating(product.productID)
            }
        })
    }

    getProductsByCategory(categoryID: number) {
        this.commonService.post<any[]>(`${environment.products.handleProduct}?action=getbycategoryid&categoryId=${categoryID}`, null).subscribe(
            (products: Product[]) => {
                this.products = products.map(product => ({
                    ...product,
                    averageRating: null,
                    hasReviews: true
                }));
                this.filteredProducts = [...this.products];
                this.totalProducts = this.filteredProducts.length;
                this.paginateProducts();
                this.loading = false;
                this.loadAverageRatings()
            }),
            (error: any) => {
                console.error('Error retrieving products', error);
            }
    }

    paginateProducts(): void {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    }

    onPageChange(event: PageEvent): void {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.paginateProducts();
    }

    onSearch(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.searchTerm = inputElement.value.toLowerCase();
        this.filteredProducts = this.products.filter(product =>
            product.productName.toLowerCase().includes(this.searchTerm) ||
            product.productDescription.toLowerCase().includes(this.searchTerm)
        );
        this.totalProducts = this.filteredProducts.length;
        this.paginateProducts();
    }

    onSortChange(sortType: string): void {
        if (sortType === 'priceAsc') {
            this.filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortType === 'priceDesc') {
            this.filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortType === 'nameAsc') {
            this.filteredProducts.sort((a, b) =>
                a.productName.localeCompare(b.productName)
            );
        } else if (sortType === 'nameDesc') {
            this.filteredProducts.sort((a, b) =>
                b.productName.localeCompare(a.productName)
            );
        }
        this.paginateProducts();
    }

    onPriceRangeChange(priceRange: string): void {
        const [min, max] = priceRange.split('-').map(value => parseInt(value, 10));
        this.filteredProducts = this.products.filter(product => {
            if (max) {
                return product.price >= min && product.price <= max;
            }
            return product.price >= min;
        });
        this.totalProducts = this.filteredProducts.length;
        this.paginateProducts();
    }

    navigateToProductDetail(productID: number): void {
        this.router.navigate([this.sessionID + `/user/products/category/${this.categoryID}/product`, productID]);
    }

    addToWishlist(product: Product): void {
        const userID = this.commonService.getUserIdFromToken();
        this.commonService.post<Wishlist[]>(`${environment.wishlsit.handleWishlist}?action=getbyid&userId=${userID}`, null)
            .subscribe((data: Wishlist[]) => {
                const isProductInWishlist = data.some(item => item.productID === product.productID);
                if (isProductInWishlist) {
                    this.snackBar.open("Product is already in your wishlist", "Close", { duration: 3000 });
                } else {
                    const wishlistItem = { ...product, userID };
                    this.commonService.post(`${environment.wishlsit.handleWishlist}?action=add`, wishlistItem).subscribe((response: any) => {
                        if (response && response.success === true) {
                            this.snackBar.open("Product added to wishlist", "Close", { duration: 3000 });
                        } else {
                            this.snackBar.open("Failed to add product to wishlist", "Close", { duration: 3000 });
                        }
                    });
                }
            });
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.sortType = '';
        this.selectedPriceRange = null;
        this.filteredProducts = [...this.products];
        this.totalProducts = this.filteredProducts.length;
        this.paginateProducts();
    }
}
