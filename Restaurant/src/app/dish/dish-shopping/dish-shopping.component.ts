import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { OrderDetailsService } from 'src/app/services/order-details.service';
import { Dish } from 'src/app/shared/dish.model';

@Component({
  selector: 'app-dish-shopping',
  templateUrl: './dish-shopping.component.html',
  styleUrls: ['./dish-shopping.component.css']
})
export class DishShoppingComponent implements OnInit, OnDestroy {
  @Input() dish!: Dish;
  @Input() inBasket:number = 0;
  basketUpdateSubscription!: Subscription;

  constructor(private orderService: OrderDetailsService,
    private cd: ChangeDetectorRef,
    public router: Router,
    private auth: AuthService) {    
  }

  ngOnInit(): void {
    this.orderService.basketUpdate.emit(this.orderService.basket);

    this.basketUpdateSubscription = this.orderService.basketUpdate.subscribe(
      (basket) => {        
        this.inBasket = basket.get(this.dish)!;
        this.cd.detectChanges(); // here i need to add this to avoid (NG0100 Error)
      }
    ) 
  }

  ngOnDestroy(): void {
    this.basketUpdateSubscription.unsubscribe();
  }

  addToBasket() {
    this.updateBasket(1);
  }

  removeFromBasket() {
    this.updateBasket(-1);
  }

  removeAllFromBasket() {
    this.updateBasket(-this.inBasket);
  }

  private updateBasket(diff:number) {
    if(!!this.auth.user.value){
      this.orderService.updateBasket(this.dish, diff);
    } else {
      this.router.navigate(["/auth"])
    }
  }

  verifyNumberOfElements() :boolean{
    return this.inBasket > this.dish.maxPerDay - 4;
  }


}
