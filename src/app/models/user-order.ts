export interface UserOrder {
    orderID: number,
    userID: number,
    orderDate: string,
    status: string,
    totalAmount: number,
    orderItems: OrderItem[]
}

export interface OrderItem {
    orderItemID: number,
    orderID: number,
    productID: number,
    quantity: number,
    price: number,
    productName: string,
    productDescription: string,
    imageURL: string,
    returnStatus: string,
    returnRequested?: boolean
}
