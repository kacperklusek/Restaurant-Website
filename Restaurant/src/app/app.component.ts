import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { DishListService } from './services/dish-list.service';
import { OrderDetailsService } from './services/order-details.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService:AuthService,
    private dishListService: DishListService,
    private orderDetailsService: OrderDetailsService) {

  }

  ngOnInit(): void {
    this.authService.autoLogin();
  }
  
}
