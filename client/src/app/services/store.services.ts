import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, map, Observable } from "rxjs";
import { PaginatedResult } from "../models/pagination";
import { ProductParams } from "../models/productParams";
import { LoginRequest, LoginResults } from "../shared/LoginResults";
import { Order, OrderItem } from "../shared/Order";
import { Product } from "../shared/Product";

@Injectable()
export class Store {

    constructor(private http: HttpClient) {

    }

    public product: Product;
    public products: Product[] = [];
    public order: Order = new Order();
    public token = "";
    public expiration = new Date();
    productParams: ProductParams;

    resetUserParams() {
        if (this.product) {
            this.productParams = new ProductParams();
        }
    }

    getProducts(productParams: ProductParams): Observable<PaginatedResult<Product[]>> {
        let params = this.getPaginationHeaders(productParams.pageNumber, productParams.pageSize);

        params = params.append('orderBy', productParams.orderBy);
        params = params.append('sortOrder', productParams.sortOrder);
        params = params.append('filterByCategory', productParams.filterByCategory);

        return this.getPaginatedResult<Product[]>("/api/products", params)
            .pipe(map(response => {
                this.products = response.result;
                return response;
            }))
    }

    getProduct(id: number) {
        const product = this.products.find(p => p.id === id);

        if (product !== undefined) return of(product);

        return this.http.get<Product>('/api/products' + id);
    }

    get loginRequired(): boolean {
        return this.token.length === 0 || this.expiration > new Date();
    }

    login(creds: LoginRequest) {
        return this.http.post<LoginResults>("/account/createtoken", creds)
            .pipe(map(data => {
                this.token = data.token;
                this.expiration = data.expiration;
            }));
    }

    checkout() {
        const headers = new HttpHeaders().set("Authorization", `Bearer ${this.token}`)

        return this.http.post("/api/orders", this.order, {
            headers: headers
        })
            .pipe(map(() => {
                this.order = new Order();
            }));
    }

    addToOrder(product: Product) {
        let item: OrderItem | undefined;

        item = this.order.items.find(o => o.productId === product.id);

        if (item) {
            item.quantity++;

            console.log("quantity", item.quantity);

        } else {
            item = new OrderItem();
            item.productId = product.id;
            item.productTitle = product.title;
            item.productArtId = product.artId;
            item.productArtist = product.artist;
            item.productCategory = product.category;
            item.productSize = product.size;
            item.unitPrice = product.price;
            item.quantity = 1;

            console.log(item);

            this.order.items.push(item);
        }
    }

    private getPaginatedResult<T>(url: string, params: HttpParams) {

        const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

        return this.http.get<T>(url, { observe: 'response', params }).pipe(
            map(response => {
                if (response.body) {
                    paginatedResult.result = response.body;
                }

                const pagination = response.headers.get('Pagination');
                if (pagination) {
                    paginatedResult.pagination = JSON.parse(pagination);
                }
                return paginatedResult;
            })
        );
    }

    private getPaginationHeaders(pageNumber: number, pageSize: number) {
        let params = new HttpParams();

        params = params.append('pageNumber', pageNumber.toString());
        params = params.append('pageSize', pageSize.toString());

        return params;
    }

}