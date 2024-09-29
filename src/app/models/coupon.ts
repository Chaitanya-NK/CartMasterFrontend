export interface Coupon {
    couponId: number,
    counponCode: string,
    discountPercentage: number,
    discountAmount: number,
    expiryDate: Date,
    minimumPurchaseAmount: number,
    createdAt: Date,
    isActive: boolean
}
