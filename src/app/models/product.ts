export interface Product {
    productID: number,
    productName: string,
    productDescription: string,
    price: number,
    stockQuantity: number,
    imageURL: string,
    categoryID: number,
    averageRating?: number | null,
    hasReviews: boolean
}
