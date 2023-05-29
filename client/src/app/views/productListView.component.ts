import { Component, OnInit } from "@angular/core";
import { Pagination } from "../models/pagination";
import { ProductParams } from "../models/productParams";
import { Store } from "../services/store.services";
import { Product } from "../shared/Product";

@Component({
    selector: "product-list",
    templateUrl: "productListView.component.html",
    styleUrls: ["productListView.component.css"]
})

export default class ProductListView implements OnInit {

    products: Product[];
    pagination: Pagination;
    productParams: ProductParams = new ProductParams();
    selectedSortOption: string = 'lowestPriceFirst';
    selectedTypeOption: string = 'allProducts';
    pageSizeOptions: string = '6';

    constructor(public store: Store) {
        this.products = store.products;
    }

    ngOnInit(): void {
        this.loadProducts();
    }

    onSortSelectionChange() {
        switch (this.selectedSortOption) {
            case 'lowestPriceFirst':
                this.productParams.orderBy = 'price';
                this.productParams.sortOrder = 'asc';
                break;
            case 'highestPriceFirst':
                this.productParams.orderBy = 'price';
                this.productParams.sortOrder = 'desc';
                break;
            case 'nameAZ':
                this.productParams.orderBy = 'name';
                this.productParams.sortOrder = 'asc';
                break;
            case 'nameZA':
                this.productParams.orderBy = 'name';
                this.productParams.sortOrder = 'desc';
                break;
            default:
                break;
        }
        this.loadProducts();
    }

    onFilterSelectionChange() {
        this.productParams.filterByCategory = this.selectedTypeOption;
        this.loadProducts();
    }

    loadProducts() {
        this.store.getProducts(this.productParams).subscribe({
            next: response => {
                this.products = response.result;
                this.pagination = response.pagination;
            }
        })
    }

    pageChanged(event: any) {
        if (event && event.page) {
            this.productParams.pageNumber = event.page;
        }
        this.productParams.pageSize = Number(this.pageSizeOptions);
        this.loadProducts();
    }
}