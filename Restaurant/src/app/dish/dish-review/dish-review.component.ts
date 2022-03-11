import { Component, Input, OnInit } from '@angular/core';
import { Rate } from 'src/app/shared/rate.model';

@Component({
  selector: 'app-dish-review',
  templateUrl: './dish-review.component.html',
  styleUrls: ['./dish-review.component.css']
})
export class DishReviewComponent implements OnInit {
  @Input() review!: Rate;

  constructor() { }

  ngOnInit(): void {
  }

}
