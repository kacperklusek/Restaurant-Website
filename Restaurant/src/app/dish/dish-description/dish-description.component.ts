import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/services/currency.service';
import { Dish } from 'src/app/shared/dish.model';

@Component({
  selector: 'app-dish-description',
  templateUrl: './dish-description.component.html',
  styleUrls: ['./dish-description.component.css']
})
export class DishDescriptionComponent implements OnInit {
  @Input() dish!: Dish;

  constructor(public currencyService: CurrencyService) { }

  ngOnInit(): void {
  }

}
