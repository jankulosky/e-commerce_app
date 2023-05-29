import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "../services/store.services";
/*import { DataService } from '../shared/dataService';*/

@Component({
    selector: "checkout",
    templateUrl: "checkout.component.html",
    styleUrls: ['checkout.component.css']
})
export class Checkout {

    public errorMessage = "";

    constructor(public store: Store, private router: Router /*public data: DataService*/) {
    }

    onCheckout() {
        this.errorMessage = "";
        this.store.checkout()
            .subscribe(() => {
                this.router.navigate(["/"]);
            }, err => {
                this.errorMessage = `Failed to checkout: ${err}`;
            })
    }
}