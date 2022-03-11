import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DishListService } from "../services/dish-list.service";
import { Dish } from "../shared/dish.model";

@Injectable({
    providedIn: "root"
})
export class DishesResolverService implements Resolve<Dish[]> {

    constructor(private dishListService: DishListService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Dish[] | Observable<Dish[]> | Promise<Dish[]> {
        if (this.dishListService.dishes.length !== 0) {
            return this.dishListService.dishes;
        } else {
            return this.dishListService.getDishes();
        }
    }
}