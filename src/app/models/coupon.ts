export interface Coupon {
    couponId: number,
    couponName: string,
    couponDescription: string,
    discountPercentage: number,
    validFrom: Date,
    validTo: Date,
    isValid: boolean
}
