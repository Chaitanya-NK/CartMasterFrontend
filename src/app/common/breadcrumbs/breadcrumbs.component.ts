import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs';
import { Product } from 'src/app/models/product';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { environment } from 'src/environments/environment.development';

interface Breadcrumb {
    label: string;
    url: string;
}

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.css']
})

export class BreadcrumbsComponent {
    breadcrumbs: Breadcrumb[] = [];

    constructor(private router: Router, private route: ActivatedRoute, private commonService: CommonServiceService) { }

    ngOnInit(): void {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                distinctUntilChanged()
            )
            .subscribe(() => {
                this.breadcrumbs = this.buildBreadcrumbs(this.route.root);
            });
    }

    buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
        const children: ActivatedRoute[] = route.children;

        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
            if (routeURL !== '') {
                url += `/${routeURL}`;
            }

            // Check for the 'breadcrumb' data
            const label = child.snapshot.data['breadcrumb'];
            if (label) {
                breadcrumbs.push({ label, url });
            }

            // Check if the current route is a product detail route
            if (child.snapshot.routeConfig?.path === ':sessionID/user/product/:id') {
                const productID = child.snapshot.params['id'];
                this.commonService.post<Product>(`${environment.products.handleProduct}?action=getbyid&productId=${productID}`, null).subscribe(
                    product => {
                        breadcrumbs.push({ label: product.productName, url });
                    },
                    error => {
                        console.error(error);
                    }
                )
            }

            return this.buildBreadcrumbs(child, url, breadcrumbs);
        }
        return breadcrumbs;
    }

}
