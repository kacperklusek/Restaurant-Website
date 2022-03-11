import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DishListService } from "src/app/services/dish-list.service";
import { Dish } from "src/app/shared/dish.model";

@Injectable({
    providedIn: "root"
})
export class DishResolverService implements Resolve<Dish> {

    constructor(private dishListService: DishListService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Dish | Observable<Dish>{
        const id = route.params["id"]
        if (this.dishListService.dishes.length !== 0) {
            return this.dishListService.getDishById(id);
            
        } else {
            return this.dishListService.getDishes().pipe(
                map((dishes:Dish[]) => {
                    let returnDish:Dish = dishes[0];
                    dishes.forEach(dish => {
                        if(dish.id == id) {
                        returnDish = dish;
                        }
                    });
                
                    return returnDish;
                })
            );            
        }
    }
}