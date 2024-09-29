export interface CartItem {
    cartItemID: number,
    productID: number,
    quantity: number,
    productName: string,
    price: number,
    imageURL: string,
    selected: boolean
}
