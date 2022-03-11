import { EventEmitter, Injectable, Output } from '@angular/core';
import { Dish } from '../shared/dish.model';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {
  @Output() basketUpdate : EventEmitter<Map<Dish, number>> = new EventEmitter();
  basket: Map<Dish, number>;
  inBasket: number = 0

  constructor() {
    this.basket = new Map();
   }

  setBasket(dishes: Dish[]) {
    dishes.forEach(dish => {
      if (! this.basket.has(dish)) {
        this.basket.set(dish, 0);
      }
    });    
  }

  updateBasket(dish: Dish, diff: number) {
    this.basket.set(dish, this.basket.get(dish)! + diff);
    this.inBasket += diff;
    this.basketUpdate.emit(this.basket);    
  }

}
