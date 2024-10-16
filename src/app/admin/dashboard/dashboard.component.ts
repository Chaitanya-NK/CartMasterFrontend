import { Component, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { environment } from 'src/environments/environment.development';
import * as ExcelJS from 'exceljs'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

    dashboardCards = [
        { title: 'Products', borderColor: '#FF5733', textColor: '#FF5733', countTextColor: '#FF5733', key: 'totalProducts' },
        { title: 'Categories', borderColor: '#000000', textColor: '#000000', countTextColor: '#000000', key: 'totalCategories' },
        { title: 'Users', borderColor: '#33FF57', textColor: '#33FF57', countTextColor: '#33FF57', key: 'totalUsers' },
        { title: 'Orders', borderColor: '#3357FF', textColor: '#3357FF', countTextColor: '#3357FF', key: 'totalOrders' },
        { title: 'Revenue', borderColor: '#FF33A6', textColor: '#FF33A6', countTextColor: '#FF33A6', key: 'revenue' },
        { title: 'Reviews', borderColor: '#33FFF5', textColor: '#33FFF5', countTextColor: '#33FFF5', key: 'totalReviews' },
        { title: 'Pending Returns', borderColor: '#FFC133', textColor: '#FFC133', countTextColor: '#FFC133', key: 'pendingReturns' },
        { title: 'Out of Stock', borderColor: '#A633FF', textColor: '#A633FF', countTextColor: '#A633FF', key: 'outOfStockProducts' },
        { title: 'Repeat Customers', borderColor: '#008080', textColor: '#008080', countTextColor: '#008080', key: 'repeatCustomersCount' },
        { title: 'Cancelled Orders', borderColor: '#B22222', textColor: '#B22222', countTextColor: '#B22222', key: 'cancelledOrders' },
        { title: 'Coupons', borderColor: '#B22222', textColor: '#B22222', countTextColor: '#B22222', key: 'coupons' },
        { title: 'Current Logins', borderColor: '#FFC133', textColor: '#FFC133', countTextColor: '#FFC133', key: 'currentLogins' }
    ];

    counts: any = {}
    loading: boolean = true;

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    salesData: any[] = []
    userGrowthData: any[] = []
    topSellingProducts: any[] = []
    wishlistInsights: any[] = []
    topReviewedProducts: any[] = []
    lowStockProducts: any[] = []
    inactiveUsers: any[] = []
    bestCategories: any[] = []

    // chart data and labels
    salesChartData: number[] = []
    salesChartLabels: string[] = []
    userGrowthChartData: number[] = []
    userGrowthChartLabels: string[] = []
    topSellingChartData: number[] = []
    topSellingChartLabels: string[] = []
    bestCategoriesChartData: number[] = []
    bestCategoriesChartLabels: string[] = []

    constructor(
        private commonService: CommonServiceService,
        private spinnerService: NgxSpinnerService
    ) {
        Chart.register(...registerables); // Required for Chart.js
        this.dataSource = new MatTableDataSource<any>(this.inactiveUsers);
    }

    ngOnInit(): void {
        this.spinnerService.show()

        setTimeout(() => {
            this.loadDashboard()
            this.spinnerService.hide()
            this.loading = false
        }, 2000);
    }

    loadDashboard() {
        this.commonService.get(environment.dashboard.getDashboardData).subscribe((data: any) => {
            // dashboard counts
            this.counts = data.dashboardData.counts
            // sales data
            this.salesData = data.dashboardData.salesData
            this.salesChartData = this.salesData.map(s => s.sales)
            this.salesChartLabels = this.salesData.map(s => `${s.year}-${s.month}`)
            // user growth
            this.userGrowthData = data.dashboardData.userGrowth
            this.userGrowthChartData = this.userGrowthData.map(u => u.userRegistrations)
            this.userGrowthChartLabels = this.userGrowthData.map(u => `${u.year}-${u.month}`)
            // top selling products
            this.topSellingProducts = data.dashboardData.topSellingProducts
            this.topSellingChartLabels = this.topSellingProducts.map((d: any) => d.productName)
            this.topSellingChartData = this.topSellingProducts.map((d: any) => d.totalSold)
            // wishlist insights
            this.wishlistInsights = data.dashboardData.wishlistInsights
            // top reviewd products
            this.topReviewedProducts = data.dashboardData.topReviewedProducts
            // low stock products
            this.lowStockProducts = data.dashboardData.lowStockProducts
            // inactive users
            this.inactiveUsers = data.dashboardData.inactiveUsers
            this.dataSource = new MatTableDataSource<any>(this.inactiveUsers);
            this.dataSource.paginator = this.paginator;
            // best categories
            this.bestCategories = data.dashboardData.bestCategories
            this.bestCategoriesChartLabels = this.bestCategories.map((c: any) => c.categoryName)
            this.bestCategoriesChartData = this.bestCategories.map((c: any) => c.totalSold)
        })
    }

    exportToExcel() {
        const workbook = new ExcelJS.Workbook()
        const countWorksheet = workbook.addWorksheet('Dashboard Count')

        countWorksheet.addRow(['Dashboard Counts'])
        countWorksheet.addRow(['Metric', 'Value'])
        for (const key in this.counts) {
            countWorksheet.addRow([key, this.counts[key]])
        }

        const salesDataWorksheet = workbook.addWorksheet('Sales Data')
        salesDataWorksheet.addRow(['Sales Data (Monthly)'])
        salesDataWorksheet.addRow(['Month', 'Sales'])
        this.salesData.forEach(sale => {
            salesDataWorksheet.addRow([`${sale.year}-${sale.month}`, sale.sales])
        })

        const userGrowthDataWorksheet = workbook.addWorksheet('User Growth Data')
        userGrowthDataWorksheet.addRow(['User Growth (Monthly)'])
        userGrowthDataWorksheet.addRow(['Month', 'User Registrations'])
        this.userGrowthData.forEach(user => {
            userGrowthDataWorksheet.addRow([`${user.year}-${user.month}`, user.userRegistrations])
        })

        const topSellingProductWorksheet = workbook.addWorksheet('Top Selling Product')
        topSellingProductWorksheet.addRow(['Top Selling Products'])
        topSellingProductWorksheet.addRow(['Product Name', 'Total Sold'])
        this.topSellingProducts.forEach(product => {
            topSellingProductWorksheet.addRow([product.productName, product.totalSold])
        })

        const wishlistInsightsWorksheet = workbook.addWorksheet('Wishlist Insights')
        wishlistInsightsWorksheet.addRow(['Wishlist Insights'])
        wishlistInsightsWorksheet.addRow(['Product Name', 'Wishlist Count'])
        this.wishlistInsights.forEach(insight => {
            wishlistInsightsWorksheet.addRow([insight.productName, insight.wishlistCount])
        })

        const topReviewsdProductsWorksheet = workbook.addWorksheet('Top Reviewed Products')
        topReviewsdProductsWorksheet.addRow(['Top Reviewed Products'])
        topReviewsdProductsWorksheet.addRow(['Product Name', 'Review Count', 'Average Rating'])
        this.topReviewedProducts.forEach(products => {
            topReviewsdProductsWorksheet.addRow([products.productName, products.reviewCount, products.averageRating])
        })

        const lowStockProductsWorksheet = workbook.addWorksheet('Low Stock Products')
        lowStockProductsWorksheet.addRow(['Low Stock Products'])
        lowStockProductsWorksheet.addRow(['Product Name', 'Stock Quantity'])
        this.lowStockProducts.forEach(products => {
            lowStockProductsWorksheet.addRow([products.productName, products.stockQuantity])
        })

        const inactiveUsersWorksheet = workbook.addWorksheet('Inactive Users')
        inactiveUsersWorksheet.addRow(['Inactive Users'])
        inactiveUsersWorksheet.addRow(['Name', 'Email'])
        this.inactiveUsers.forEach(users => {
            inactiveUsersWorksheet.addRow([users.name, users.email])
        })

        const bestCategoriesWorksheet = workbook.addWorksheet('Best Categories (sales)')
        bestCategoriesWorksheet.addRow(['Best Categories (sales)'])
        bestCategoriesWorksheet.addRow(['Category Name', 'Total Sold'])
        this.bestCategories.forEach(category => {
            bestCategoriesWorksheet.addRow([category.categoryName, category.totalSold])
        })

        workbook.xlsx.writeBuffer().then((buffer) => {
            const date = new Date()
            const blob = new Blob([buffer], { type: 'application/octet-stream' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${date.toDateString()}_dashboard_data.xlsx`
            a.click()
            window.URL.revokeObjectURL(url)
        })
    }
}