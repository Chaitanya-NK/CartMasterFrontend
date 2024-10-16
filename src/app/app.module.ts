import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatBadgeModule } from '@angular/material/badge'
import { MatMenuModule } from '@angular/material/menu'
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatSliderModule } from '@angular/material/slider'
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper'
import { MatRadioModule } from '@angular/material/radio'
import { MatDividerModule } from '@angular/material/divider'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list'
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { NgChartsModule } from 'ng2-charts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatSortModule } from '@angular/material/sort';

import { ToolbarComponentComponent } from './user/toolbar-component/toolbar-component.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { ProductImageDialogComponent } from './admin/product-image-dialog/product-image-dialog.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AuthInterceptor } from 'src/auth.interceptor';
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
import { CardPlaceholderComponent } from './placeholders/card-placeholder/card-placeholder.component';
import { TablePlaceholderComponent } from './placeholders/table-placeholder/table-placeholder.component';
import { BufferProgressBarComponent } from './placeholders/buffer-progress-bar/buffer-progress-bar.component';
import { CardTablePlaceholderComponent } from './placeholders/card-table-placeholder/card-table-placeholder.component';
import { SpinnerComponent } from './placeholders/spinner/spinner.component';
import { RegisterOtpComponent } from './auth/register-otp/register-otp.component';
import { PaymentUnderwayDialogComponent } from './user/payment-underway-dialog/payment-underway-dialog.component';
import { OrderCancelDialogComponent } from './user/order-cancel-dialog/order-cancel-dialog.component';
import { ReturnConfirmationDialogComponent } from './user/return-confirmation-dialog/return-confirmation-dialog.component';
import { RequestReturnSpinnerDialogComponent } from './user/request-return-spinner-dialog/request-return-spinner-dialog.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminCouponsComponent } from './admin/admin-coupons/admin-coupons.component';
import { MatNativeDateModule } from '@angular/material/core';
import { CouponDialogComponent } from './user/coupon-dialog/coupon-dialog.component';
import { ProductShareSocialDialogComponent } from './user/product-share-social-dialog/product-share-social-dialog.component';
import { BreadcrumbsComponent } from './common/breadcrumbs/breadcrumbs.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AboutUsComponent } from './user/about-us/about-us.component';
import { ContactUsComponent } from './user/contact-us/contact-us.component';
import { FooterComponent } from './user/footer/footer.component';
import { AdminUserSessionTrackerComponent } from './admin/admin-user-session-tracker/admin-user-session-tracker.component';
import { PageNotFoundComponent } from './common/page-not-found/page-not-found.component';
import { ProductsByCategoryComponent } from './user/products-by-category/products-by-category.component';
import { CategoriesComponent } from './user/categories/categories.component';

const customNotifierOptions: NotifierOptions = {
    position: {
        horizontal: {
            position: 'left',
            distance: 12
        },
        vertical: {
            position: 'bottom',
            distance: 12,
            gap: 10
        }
    },
    theme: 'material',
    behaviour: {
        autoHide: 5000,
        onClick: 'hide',
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
    },
    animations: {
        enabled: true,
        show: {
            preset: 'slide',
            speed: 300,
            easing: 'ease'
        },
        hide: {
            preset: 'fade',
            speed: 300,
            easing: 'ease',
            offset: 50
        },
        shift: {
            speed: 300,
            easing: 'ease'
        },
        overlap: 150
    }
};

@NgModule({
    declarations: [
        AppComponent,
        ToolbarComponentComponent,
        RegisterComponent,
        LoginComponent,
        AdminProductsComponent,
        ProductImageDialogComponent,
        AdminCategoryComponent,
        AdminUsersComponent,
        WelcomeComponent,
        ProfileComponent,
        AdminUserOrdersComponent,
        ProductDetailComponent,
        ProductWishlistComponent,
        CartComponent,
        CheckoutComponent,
        PaymentStatusComponent,
        ViewAllOrdersComponent,
        TrackOrderComponent,
        CardPlaceholderComponent,
        TablePlaceholderComponent,
        BufferProgressBarComponent,
        CardTablePlaceholderComponent,
        SpinnerComponent,
        RegisterOtpComponent,
        PaymentUnderwayDialogComponent,
        OrderCancelDialogComponent,
        ReturnConfirmationDialogComponent,
        RequestReturnSpinnerDialogComponent,
        DashboardComponent,
        AdminCouponsComponent,
        CouponDialogComponent,
        ProductShareSocialDialogComponent,
        BreadcrumbsComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        AboutUsComponent,
        ContactUsComponent,
        FooterComponent,
        AdminUserSessionTrackerComponent,
        PageNotFoundComponent,
        ProductsByCategoryComponent,
        CategoriesComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatGridListModule,
        MatToolbarModule,
        MatBadgeModule,
        MatMenuModule,
        HttpClientModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        MatSelectModule,
        MatExpansionModule,
        MatSnackBarModule,
        MatAutocompleteModule,
        MatSliderModule,
        MatTooltipModule,
        MatStepperModule,
        MatRadioModule,
        MatDividerModule,
        MatProgressBarModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        MatListModule,
        NotifierModule.withConfig(customNotifierOptions),
        NgChartsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        RouterModule,
        RecaptchaModule,
        NgxSpinnerModule.forRoot(),
        MatSortModule
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    }, MatDatepickerModule],
    bootstrap: [AppComponent]
})
export class AppModule { }
