import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { PageEvent } from '@angular/material/paginator';
import { CommonServiceService } from '../../services/common-service.service';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Wishlist } from 'src/app/models/wishlist';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

    products: Product[] = [];
    filteredProducts: Product[] = [];
    paginatedProducts: Product[] = [];
    categories: Category[] = [];
    priceRanges: string[] = ['0-500', '501-1000', '1001-5000', '5000+'];
    selectedCategory: string | null = null;
    selectedPriceRange: string | null = null;
    searchTerm: string = '';
    sortType: string = '';
    loading: boolean = true;
    placeholders = Array(3);

    // Pagination variables
    pageSize: number = 6;  // Number of items per page
    currentPage: number = 0;  // Track current page
    totalProducts: number = 0;  // Total number of products

    constructor(
        private commonService: CommonServiceService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadCategories();
        this.getProducts();
    }

    loadAverageRating(productID: number): void {
        this.commonService.getById<number>(environment.reviews.getAverageRating, { productId: productID }).subscribe(
            rating => {
                const product = this.products.find(p => p.productID === productID)
                if(product) {
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
            if(product.hasReviews) {
                this.loadAverageRating(product.productID)
            }
        })
    }

    loadCategories(): void {
        this.commonService.post<Category[]>(`${environment.categories.handleCategory}?action=getall`,null).subscribe(
            (response: Category[]) => {
                this.categories = response;
            },
            (error) => {
                console.error('Error while retrieving categories', error);
            }
        );
    }

    getProducts(): void {
        setTimeout(() => {
            this.commonService.post<Product[]>(`${environment.products.handleProduct}?action=getall`, null).subscribe(
                (response: Product[]) => {
                    this.products = response.map(product => ({
                        ...product,
                        averageRating: null,
                        hasReviews: true
                    }));
                    this.filteredProducts = [...this.products];
                    this.totalProducts = this.filteredProducts.length;
                    this.paginateProducts();
                    this.loading = false;
                    this.loadAverageRatings()
                },
                (error) => {
                    console.error('Error retrieving products', error);
                }
            );
        }, 1000);
    }

    // Pagination logic
    paginateProducts(): void {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    }

    // Update pagination when page changes
    onPageChange(event: PageEvent): void {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.paginateProducts();
    }

    // Filtering logic
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

    onCategoryChange(categoryID: number): void {
        this.filteredProducts = this.products.filter((product) => {
            return product.categoryID === categoryID
        });
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
        this.router.navigate(['user/product/', productID]);
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
        this.selectedCategory = null;
        this.sortType = '';
        this.selectedPriceRange = null;
        this.filteredProducts = [...this.products];
        this.totalProducts = this.filteredProducts.length;
        this.paginateProducts();
    }
}