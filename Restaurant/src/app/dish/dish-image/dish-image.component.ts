import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { Dish } from 'src/app/shared/dish.model';

@Component({
  selector: 'app-dish-image',
  templateUrl: './dish-image.component.html',
  styleUrls: ['./dish-image.component.css']
})
export class DishImageComponent implements OnInit {
  @Input() dish!: Dish;

  constructor(private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onImageClick() {
    if (!!this.auth.user.value) {      
      this.router.navigate([this.dish.id], {relativeTo: this.route})
    } else {
      this.router.navigate(["/auth"])
    }
  }

}
