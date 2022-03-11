import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { DishListService } from 'src/app/services/dish-list.service';
import { OrderDetailsService } from 'src/app/services/order-details.service';
import { Dish } from 'src/app/shared/dish.model';

@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css']
})
export class DishDetailsComponent implements OnInit, OnDestroy {
  dish!: Dish;

  id!:string;
  dishesLoadedSubscription!: Subscription;
  basketUpdateSubscription!: Subscription;
  inBasketDishes! :Map<Dish, number>;

  constructor(private dishListService: DishListService,
    private route:ActivatedRoute,
    public router:Router,
    public currencyService:CurrencyService,
    private orderDetailsService: OrderDetailsService,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"];
    this.dish = this.dishListService.getDishById(this.id);
    
    this.dishesLoadedSubscription = this.dishListService.dishesLoaded.subscribe(
      (dishes: Dish[]) => {        
        this.dish = this.dishListService.getDishById(this.id);     
        this.orderDetailsService.setBasket(dishes);
      });

      this.basketUpdateSubscription = this.orderDetailsService.basketUpdate.subscribe(
        (basket) => {
          this.inBasketDishes = basket
        } 
      )
  }

  ngOnDestroy(): void {
      this.dishesLoadedSubscription.unsubscribe();
  }

  getInBasket() {
    if (this.inBasketDishes === undefined) {
      return 0
    }
    return this.inBasketDishes.get(this.dish) || 0
  }

  isBanned() :boolean {    
    if (this.auth.user.value) {
      return this.auth.user.value.banned;
    }
    return false;
  }

}
