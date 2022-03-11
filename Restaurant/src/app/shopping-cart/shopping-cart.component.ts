import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CurrencyService } from '../services/currency.service';
import { OrderDetailsService } from '../services/order-details.service';
import { UsersService } from '../services/users.service';
import { Dish } from '../shared/dish.model';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  inBasketDishes! :Map<Dish, number>;
  sumInBasket: number = 0;
  basketUpdateSubscription!: Subscription;

  constructor(private orderDetailsService: OrderDetailsService,
    public currencyService: CurrencyService, private cd:ChangeDetectorRef,
    private usersService: UsersService,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.inBasketDishes = this.orderDetailsService.basket;
    for (let [dish, inBasket] of this.inBasketDishes){
      this.sumInBasket += dish.price * inBasket;
    }
    this.basketUpdateSubscription = this.orderDetailsService.basketUpdate.subscribe(
      (basket) => {
        this.inBasketDishes = basket
        this.sumInBasket = 0;
        for (let [dish, inBasket] of this.inBasketDishes){
          this.sumInBasket += dish.price * inBasket;
        }
      } 
    )
  }

  ngOnDestroy(): void {
      this.basketUpdateSubscription.unsubscribe();
  }

  onBuyNow() {
    if (!this.auth.user.value) {
      return
    }
    const user = this.addDishesFromBasket(this.auth.user.value, this.inBasketDishes);
    this.usersService.updateUser(user).subscribe();
    this.clearBasket()
    this.router.navigate(["/menu"])
  }

  addDishesFromBasket(user: User, inBasketDishes:Map<Dish, number>) :User {
    inBasketDishes.forEach((value: number, key:Dish) => {
      if (value > 0 && ! user.boughtDishes.includes(key.id!)) {
        user.boughtDishes.push(key.id!)
      }
    });
    return user;
  }

  clearBasket() {
    this.inBasketDishes.forEach((value: number, key:Dish) => {      
      //@ts-ignore
      this.inBasketDishes.set(key, 0);
      this.orderDetailsService.updateBasket(key, -value);
    });
    console.log(this.inBasketDishes);
  }

}
