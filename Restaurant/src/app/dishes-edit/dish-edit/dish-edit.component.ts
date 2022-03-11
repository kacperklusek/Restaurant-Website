import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DishListService } from 'src/app/services/dish-list.service';
import { Dish } from 'src/app/shared/dish.model';
import { DishResolverService } from './dish-resolver.service';

@Component({
  selector: 'app-dish-edit',
  templateUrl: './dish-edit.component.html',
  styleUrls: ['./dish-edit.component.css']
})
export class DishEditComponent implements OnInit {
  dish!: Dish;
  

  constructor(private dishListService: DishListService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log("ngoniinit");
    
    // REMINDER
    // here i use snapshot, thought if i was to check if :id param changed i would need to subscribe
    const id = this.route.snapshot.params["id"];
    this.dish = this.dishListService.getDishById(id);
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return
    }

    this.dishListService.updateDish(this.dish).subscribe(
      () => {
        console.log("dish updated");
      }
    );
  }

}
