import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DishListService } from 'src/app/services/dish-list.service';
import { Dish } from 'src/app/shared/dish.model';
import { Rate } from 'src/app/shared/rate.model';

@Component({
  selector: 'app-dish-rate',
  templateUrl: './dish-rate.component.html',
  styleUrls: ['./dish-rate.component.css']
})
export class DishRateComponent implements OnInit, OnDestroy{
  @Input() dish!:Dish;
  @ViewChild("frm") rateForm!: NgForm;
  ratesCount: number = 0;
  ratesSum: number = 0;
  ratingSubscription! :Subscription;

  constructor(private dishListSetvice: DishListService,
    public auth:AuthService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
      if (this.ratingSubscription !== undefined) {
        this.ratingSubscription.unsubscribe();
      }
  }

  onSubmit() {
    if (this.auth.user.value?.banned === true) {
      return
    }

    const newReview :Rate = {
      nickName: this.rateForm.value.nickName,
      name: this.rateForm.value.name,
      content: this.rateForm.value.content,
      purchaseDate: this.rateForm.value.purchaseDate,
      rate: this.rateForm.value.rate,
      userID: this.auth.user.value!.id
    }

    this.dish.rating.push(newReview);
    this.dish.rate = this.getRate(this.dish, newReview.rate);

    this.ratingSubscription = this.dishListSetvice.updateDish(this.dish).subscribe();
    
    this.rateForm.reset();
  }

  getRate(dish:Dish, newRate:number) :number {
    if (dish.rate === "no reviews") {
      return newRate;
    } 
    else {      
      let ratesSum = 0;
      let ratesCount = 0;
      dish.rating.forEach((review:Rate) => {
        ratesSum += review.rate
        ratesCount++;
      });
      return ratesSum/ratesCount;
    }
  }

  boughtDish() :boolean {
    if (this.auth.user.value && this.dish.id) {
      return this.auth.user.value.boughtDishes.includes(this.dish.id);
    }
    return false;
  }

  givenReview() : boolean {
    let output:boolean = false;
    this.dish.rating.forEach((rate:Rate) => {
      if (rate.userID === this.auth.user.value?.id) {
        output = true;        
      }
    });    
    return output;
  }

}
