import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CurrencyService } from '../services/currency.service';
import { OrderDetailsService } from '../services/order-details.service';
import { Dish } from '../shared/dish.model';

@Component({
  selector: 'app-dish',
  templateUrl: './dish.component.html',
  styleUrls: ['./dish.component.css']
})
export class DishComponent implements OnInit {
  @Input() dish!: Dish;
  @Input() hasMinPrice!: boolean;
  @Input() hasMaxPrice!: boolean;
  @Output() deleteDish = new EventEmitter<Dish>();

  constructor(public currencyService: CurrencyService,
    private orderService: OrderDetailsService,
    public auth: AuthService,
    public router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {    
  }

  onDeleteDish() {
    this.deleteDish.emit(this.dish);
  }

  getInBasket() :number{
    if (this.orderService.basket.get(this.dish) === undefined) {
      return 0;
    } else {
      //@ts-ignore
      return this.orderService.basket.get(this.dish);
    }
  }

  onEditDish() {
    if (! this.auth.hasRole("Admin")) {
      return
    }
    this.router.navigate([this.dish.id], {relativeTo: this.route});
  }
}
