export interface Coupon {
    couponID: number,
    couponName: string,
    couponDescription: string,
    discountPercentage: number,
    validFrom: Date,
    validTo: Date,
    isValid: boolean
}
