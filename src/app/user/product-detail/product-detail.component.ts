import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../models/product';
import { ActivatedRoute } from '@angular/router';
import { CommonServiceService } from '../../services/common-service.service';
import { environment } from 'src/environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserReview } from 'src/app/models/user-review';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

    product: Product | null = null
    quantity: number = 1
    newReviewText: string = '';
    newReviewRating: number = 0;
    averageRating!: number;
    reviews: UserReview[] = [];
    stars: boolean[] = [false, false, false, false, false];
    loading: boolean = false
    hasUserReviewed: boolean = false
    userReview: UserReview | null = null
    userId: number = this.commonService.getUserIdFromToken()
    userName: number = this.commonService.getUserNameFromToken()
    suggestedProducts: Product[] = []
    

    @ViewChild('zoomImage', { static: true }) zoomImage!: ElementRef<HTMLImageElement>
    @ViewChild('zoomLens', { static: true }) zoomLens!: ElementRef<HTMLDivElement>

    constructor(
        private route: ActivatedRoute,
        private commonService: CommonServiceService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const productID = +params.get('id')!
            this.loadProductDetails(productID)
            this.loadAverageRating(productID)
            this.loadReviews(productID);
            this.commonService.post<Product>(`${environment.products.handleProduct}?action=getbyid&productId=${productID}`, null).subscribe(
                product => {
                    this.product = product
                    if(product) {
                        this.loadSuggestedProducts(product.categoryID, product.productID)                        
                    }
                },
                error => {
                    console.error('Error loading suggested products', error);
                }
            )
        })
    }

    loadProductDetails(productID: number): void {
        this.commonService.post<Product>(`${environment.products.handleProduct}?action=getbyid&productId=${productID}`, null).subscribe(
            product => {
                this.product = product
            },
            error => {
                console.error(error);
            }
        )
    }

    increaseCount(): void {
        this.loading = true
        setTimeout(() => {
            this.quantity++
            this.loading = false
        }, 1000)

    }

    decreaseCount(): void {
        if (this.quantity > 1) {
            this.loading = true
            setTimeout(() => {
                this.quantity--
                this.loading = false
            }, 1000)
        }
    }

    zoom(event: MouseEvent) {
        const lens = this.zoomLens.nativeElement
        const image = this.zoomImage.nativeElement

        lens.style.display = 'block'

        const x = event.offsetX - lens.offsetWidth / 2
        const y = event.offsetY - lens.offsetHeight / 2

        lens.style.left = `${x}px`
        lens.style.top = `${y}px`

        const zoomLevel = 2
        image.style.transform = `scale(${zoomLevel})`
        image.style.transformOrigin = `${event.offsetX}px ${event.offsetY}px`
    }

    resetZoom() {
        const lens = this.zoomLens.nativeElement
        const image = this.zoomImage.nativeElement

        lens.style.display = 'none'
        image.style.transform = 'none'
    }

    getCartIdFromToken(): number {
        const token: any = localStorage.getItem('token')
        const decodedToken = JSON.parse(atob(token.split('.')[1]))
        const cartID = decodedToken.CartID
        return cartID
    }

    addToCart(product: Product) {
        const cartId = this.getCartIdFromToken()
        const body = {
            cartId: cartId,
            productId: product.productID,
            quantity: this.quantity,
            productName: product.productName,
            price: product.price,
            imageURL: product.imageURL
        }
        this.commonService.post(`${environment.cart.handleCart}?action=add`, body).subscribe(
            (response: any) => {
                if (response && response.success === true) {
                    this.snackBar.open("Product added to Cart", "Close", {
                        verticalPosition: 'top',
                        horizontalPosition: 'right'
                    })
                }
            },
            error => {
                this.snackBar.open("Failed to add product to Cart", "Close", {
                    verticalPosition: 'top',
                    horizontalPosition: 'right'
                })
            }
        )
    }

    loadReviews(productID: number): void {
        this.commonService.post<any[]>(`${environment.reviews.handleProductReviews}?action=getbyid&productId=${productID}`, null).subscribe(
            reviews => {
                this.reviews = reviews;
                this.userReview = this.reviews.find(review => review.userID === this.userId) || null
                this.hasUserReviewed = !!this.userReview
            },
            error => {
                console.error(error);
            }
        );
    }

    setRating(rating: number): void {
        this.newReviewRating = rating;
    }

    submitReview(): void {
        if (this.product && this.newReviewText && this.newReviewRating > 0) {
            const body = {
                productId: this.product.productID,
                comment: this.newReviewText,
                rating: this.newReviewRating,
                userId: this.userId,
                userName: this.commonService.getUserNameFromToken()
            };
            this.commonService.post(`${environment.reviews.handleProductReviews}?action=add`, body).subscribe(
                (response: any) => {
                    if (response.success === true) {
                        this.snackBar.open("Review added", "Close", {
                            verticalPosition: 'top',
                            horizontalPosition: 'right'
                        })
                    }
                    this.loadReviews(this.product?.productID!); // Reload reviews
                    this.loadAverageRating(this.product?.productID!)
                    this.newReviewRating = 0
                    this.newReviewText = ''
                    this.hasUserReviewed = true
                },
                error => {
                    console.error('Error submitting review', error);
                }
            );
        }
    }

    deleteReview(): void {
        if(this.userReview) {
            this.commonService.post(`${environment.reviews.handleProductReviews}?action=delete&reviewId=${this.userReview.reviewID}`, null).subscribe(
                (response: any) => {
                    if(response.success === true) {
                        this.snackBar.open("Review Deleted", "Close", {duration: 3000})
                        this.userReview = null
                        this.hasUserReviewed = false
                        this.loadReviews(this.product?.productID!)
                        this.loadAverageRating(this.product?.productID!)
                    }
                },
                error => {
                    console.error(error);
                }
            )
        }
    }

    startEditingReview(): void {
        if(this.userReview) {
            this.newReviewRating = this.userReview.rating
            this.newReviewText = this.userReview.comment
            this.hasUserReviewed = false
        }
    }    

    editReview(): void {
        if(this.userReview && this.newReviewText && this.newReviewRating > 0) {
            const body = {
                reviewId: this.userReview.reviewID,
                comment: this.userReview.comment,
                rating: this.userReview.rating
            }
            this.commonService.post(`${environment.reviews.handleProductReviews}?action=update`, body).subscribe(
                (response: any) => {
                    if(response.success === true) {
                        this.snackBar.open("Review Edited", "Close", {duration: 3000})
                        this.loadReviews(this.product?.productID!)
                        this.loadAverageRating(this.product?.productID!)
                        this.newReviewText = ''
                        this.newReviewRating = 0
                        this.hasUserReviewed = true
                    }
                },
                error => {
                    console.error(error);
                }
            )
        }
    }

    loadAverageRating(productID: number): void {
        this.commonService.getById<number>(environment.reviews.getAverageRating, { productId: productID }).subscribe(
            rating => {
                this.averageRating = rating;
            },
            error => {
                console.error('Error loading average rating', error);
            }
        );
    }

    loadSuggestedProducts(categoryID: number, currentProductID: number) {
        this.commonService.post<Product[]>(`${environment.products.handleProduct}?action=getbycategoryid&categoryId=${categoryID}`, null).subscribe(
            products => {
                this.suggestedProducts = products.filter(p => p.productID !== currentProductID)
            },
            error => {
                console.error('Error while loading suggested products', error);
            }
        )
    }
}
