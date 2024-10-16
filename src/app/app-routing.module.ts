import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { WelcomeComponent } from './common/welcome/welcome.component';
import { ProfileComponent } from './common/profile/profile.component';
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
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AboutUsComponent } from './user/about-us/about-us.component';
import { ContactUsComponent } from './user/contact-us/contact-us.component';
import { FooterComponent } from './user/footer/footer.component';
import { PageNotFoundComponent } from './common/page-not-found/page-not-found.component';
import { CategoriesComponent } from './user/categories/categories.component';
import { ProductsByCategoryComponent } from './user/products-by-category/products-by-category.component';
import { AdminUserSessionTrackerComponent } from './admin/admin-user-session-tracker/admin-user-session-tracker.component';

const routes: Routes = [
    { path: '', component: WelcomeComponent, data: { breadcrumb: 'Home' }  },
    { path: 'footer', component: FooterComponent },
    { path: ':sessionID/user/categories', component: CategoriesComponent },
    { path: ':sessionID/about-us', component: AboutUsComponent, data: { breadcrumb: 'About Us' } },
    { path: ':sessionID/contact-us', component: ContactUsComponent, data: { breadcrumb: 'Contact Us' }  },
    { path: ':sessionID/profile', component: ProfileComponent },
    { path: ':sessionID/wishlist', component: ProductWishlistComponent },
    { path: ':sessionID/cart', component: CartComponent },
    { path: ':sessionID/checkout', component: CheckoutComponent },
    { path: ':sessionID/payment-status', component: PaymentStatusComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'verify-otp', component: RegisterOtpComponent },
    { path: ':sessionID/admin/dashboard', component: DashboardComponent },
    { path: ':sessionID/admin/product', component: AdminProductsComponent },
    { path: ':sessionID/admin/category', component: AdminCategoryComponent },
    { path: ':sessionID/admin/users', component: AdminUsersComponent },
    { path: ':sessionID/admin/coupons', component: AdminCouponsComponent },
    { path: ':sessionID/admin/userOrders/:id', component: AdminUserOrdersComponent },
    { path: ':sessionID/user/products/category/:id/product/:id', component: ProductDetailComponent, data: { breadcrumb: 'Product Details' } },
    { path: ':sessionID/user/products/category/:id', component: ProductsByCategoryComponent, data: { breadcrumb: 'Product Details' } },
    { path: ':sessionID/user/orders', component: ViewAllOrdersComponent },
    { path: ':sessionID/user/order/track-order/:id', component: TrackOrderComponent },
    { path: ':sessionID/admin/track-user-ip', component: AdminUserSessionTrackerComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
