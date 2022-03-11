import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DishListService } from '../services/dish-list.service';
import { FilterService } from '../services/filter.service';
import { OrderDetailsService } from '../services/order-details.service';
import { Dish } from '../shared/dish.model';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit, OnDestroy {
  dishes:Dish[] = [];
  addDishSubscription!:Subscription;
  filterSubscription!:Subscription;
  dishLoadedSubscription!: Subscription;

  maxDishPrice!: number;
  minDishPrice!: number;

  dishAttributes = {
    name: new Set,
    cuisineType: new Set,
    type: new Set,
    category: new Set,
    ingredient: new Set,
    maxPerDay: new Set,
    price: new Set,
    description: new Set,
    imgUrl: new Set,
    rate: new Set
  }

  pageSize: number = 8;  // initial page size
  currentPage:number = 1;
  currentPageRange: [number, number] = [
    this.pageSize * (this.currentPage - 1),
     this.pageSize * this.currentPage
    ];

  
  constructor(public dishListService: DishListService,
    private orderService: OrderDetailsService,
    public filterService: FilterService) {
  }

  ngOnInit() {
    console.log("on init in dishes component");
    
    this.dishLoadedSubscription = this.dishListService.dishesLoaded.subscribe((dishes) => {
      this.dishes = dishes;
      this.getDishPrices();    
      this.updateBasketList(this.dishes);
    })
    this.dishes = this.dishListService.dishes;
    this.getDishPrices();    
    this.updateBasketList(this.dishes);
    
    this.addDishSubscription = this.dishListService.onAddDish.subscribe(
      (obsDish) => {
        obsDish.subscribe(
          (dish) => {
            this.dishes.push(dish);
            this.getDishPrices();
            this.updateBasketList(this.dishes);
          }
        )
      }
    );

    this.filterSubscription = this.filterService.filterChanged.subscribe(
      (newFilters) => {
        this.dishAttributes = newFilters;
      }
    );
  }

  ngOnDestroy(): void {
      this.addDishSubscription.unsubscribe();
      this.filterSubscription.unsubscribe();
      this.dishLoadedSubscription.unsubscribe();
  }

  removeDish(dish: Dish) {
    //pass
  }

  private getDishPrices() :void {    
    this.maxDishPrice = 0;
    this.minDishPrice = Infinity;
    this.dishes.forEach(dish => {      
      this.minDishPrice = Math.min(this.minDishPrice, dish.price);
      this.maxDishPrice = Math.max(this.maxDishPrice, dish.price);
    });
  }

  private updateBasketList(dishes: Dish[]) {
    this.orderService.setBasket(this.dishes);
    
    // if I remove dish from list, then I can't have it in the shopping cart, therefore i must remove it
    // following code is responsible for it
    for (let dish of this.orderService.basket.keys()){
      if (! dishes.includes(dish)) {
        //@ts-ignore
        this.orderService.inBasket -= this.orderService.basket.get(dish);
        this.orderService.basket.delete(dish);
      }
    }
  }


  isInPage(i:number) {
    return i >= this.currentPageRange[0] && i < this.currentPageRange[1];
  }

  onSwipeRight() {
    this.currentPage += 1;
    this.currentPageRange[0] += this.pageSize;
    this.currentPageRange[1] += this.pageSize;    
  }

  onSwipeLeft() {
    this.currentPage -= 1;
    this.currentPageRange[0] -= this.pageSize;
    this.currentPageRange[1] -= this.pageSize;
  }

  onSelectPageSize() {
    this.pageSize = +this.pageSize; //convert to number because in <option> tag string is being held
    this.currentPageRange = [
    this.pageSize * (this.currentPage - 1),
     this.pageSize * this.currentPage
    ];
  }
}
