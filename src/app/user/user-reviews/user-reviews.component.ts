import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { UserReview } from 'src/app/models/user-review';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-user-reviews',
    templateUrl: './user-reviews.component.html',
    styleUrls: ['./user-reviews.component.css']
})
export class UserReviewsComponent implements OnInit {

    product: Product | null = null
    newReviewText: string = ''
    newReviewRating: number = 0
    averageRating!: number
    reviews: UserReview[] = []
    stars: boolean[] = [false, false, false, false, false]
    hasUserReviewed: boolean = false
    userReview: UserReview | null = null
    userId: number = this.commonService.getUserIdFromToken()
    userName: string = this.commonService.getUserNameFromToken()

    constructor(
        private commonService: CommonServiceService,
        private snackBar: MatSnackBar,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const productID = +params.get('id')!
            
            this.loadAverageRating(productID)            
            this.loadReviews(productID)
        })
    }

    loadReviews(productID: number): void {
        this.commonService.post<any[]>(`${environment.reviews.handleProductReviews}?action=getbyid&productId=${productID}`, null).subscribe(
            reviews => {
                this.reviews = reviews
                this.userReview = this.reviews.find(review => review.userID === this.userId) || null
                this.hasUserReviewed = !!this.userReview
                console.log(this.reviews);
                
            },
            error => {
                console.error(error);
            }
        )
    }

    setRating(rating: number): void {
        this.newReviewRating = rating
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
}
