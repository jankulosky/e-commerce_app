import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "../services/store.services";
import { Product } from "../shared/Product";

@Component({
    selector: "product-detail",
    templateUrl: "productDetailPage.component.html",
    styleUrls: ["productDetailPage.component.css"]
})

export class ProductDetailPage implements OnInit {

    pageTitle = 'Product Detail';
    errorMessage = '';
    product: Product | undefined;

    constructor(public store: Store, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.getProduct(id);
        }
    }

    getProduct(id: number): void {
        this.store.getProduct(id).subscribe({
            next: (product) => (this.product = product),
            error: err => this.errorMessage = err
        });
    }

    onBack(): void {
        this.router.navigate(['/']);
    }

}