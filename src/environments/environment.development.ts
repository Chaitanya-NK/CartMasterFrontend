export const environment = {
    production: false,
    baseURL: 'https://localhost:7081/api/',
    register: {
        register: 'User/Register'
    },
    login: {
        login: 'User/Login'
    },
    userSession: {
        handleUserSession: 'UserSession/HandleUserSession'
    },
    resetPassword: {
        requestResetPassword: 'User/request-password-reset',
        resetPassword: 'User/reset-password'
    },
    email: {
        sendEmail: 'Email/SendEmail'
    },
    wishlsit: {
        handleWishlist: 'Wishlist/HandleWishlist'
    },
    products: {
        handleProduct: 'Product/HandleProduct'
    },
    categories: {
        handleCategory: 'Category/HandleCategory'
    },
    users: {
        get: 'User/GetAllUsers',
        getById: 'User/GetUserById/:userId',
        update: 'User/UpdateUser',
        saveAddress: 'User/SaveUserAddress',
        getAddress: 'User/GetUserAddressByUserId/:userId',
        verifyOTP: 'User/VerifyOTP'
    },
    cart: {
        getCartItemCountByCartId: 'Cart/GetCartItemCountByCartId/:cartId',
        handleCart: 'Cart/HandleCart'
    },
    payments: {
        handlePayment: 'Payment/HandlePayment'
    },
    orders: {
        getInvoiceByOrderId: 'Order/GetOrderInvoice/:orderId',
        handleOrder: 'Order/HandleOrder'
    },
    menuItems: {
        get: 'MenuItem/GetMenuItemsByRoleId?roleId='
    },
    reviews: {
        getAverageRating: 'ProductReview/GetAverageRatingOfProduct/:productId',
        handleProductReviews: 'ProductReview/HandleProductReviews'
    },
    dashboard: {
        getDashboardData: 'DashboardCounts/GetDashboardData'
    },
    coupons: {
        handleCoupons: 'Coupon/HandleCoupon'
    }
};