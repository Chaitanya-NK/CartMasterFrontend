import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { WelcomeComponent } from './common/welcome/welcome.component';
import { ProfileComponent } from './common/profile/profile.component';
import { ProductsComponent } from './user/products/products.component';
import { AdminUserOrdersComponent } from './admin/admin-user-orders/admin-user-orders.component';
import { ProductDetailComponent } from './user/product-detail/product-detail.component';
import { ProductWishlistComponent } from './user/product-wishlist/product-wishlist.component';
import { CartComponent } from './user/cart/cart.component';
import { CheckoutComponent } from './user/checkout/checkout.component';
import { PaymentStatusComponent } from './user/payment-status/payment-status.component';
import { ViewAllOrdersComponent } from './user/view-all-orders/view-all-orders.component';
import { TrackOrderComponent } from './user/track-order/track-order.component';
import { RegisterOtpComponent } from './auth/register-otp/register-otp.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminCouponsComponent } from './admin/admin-coupons/admin-coupons.component';

const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'wishlist', component: ProductWishlistComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'payment-status', component: PaymentStatusComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'verify-otp', component: RegisterOtpComponent },
    { path: 'admin/dashboard', component: DashboardComponent },
    { path: 'admin/product', component: AdminProductsComponent },
    { path: 'admin/category', component: AdminCategoryComponent },
    { path: 'admin/users', component: AdminUsersComponent },
    { path: 'admin/coupons', component: AdminCouponsComponent },
    { path: 'admin/userOrders/:id', component: AdminUserOrdersComponent },
    { path: 'user/products', component: ProductsComponent },
    { path: 'user/product/:id', component: ProductDetailComponent },
    { path: 'user/orders', component: ViewAllOrdersComponent },
    { path: 'user/order/track-order/:id', component: TrackOrderComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
