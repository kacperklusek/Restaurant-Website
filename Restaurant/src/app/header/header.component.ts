import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { OrderDetailsService } from '../services/order-details.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;

  private userSub! :Subscription;

  constructor(public orderService: OrderDetailsService,
    public authService:AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;   
    })
  }

  ngOnDestroy(): void {
      this.userSub.unsubscribe();
  }


  goToBottom() {
    window.scrollTo(0, document.body.scrollHeight)
  }

  onLogout() {
    this.authService.logout();
  }

  isCustomer() :boolean {
      return this.authService.hasRole("Customer");
  }

  isManager() :boolean {
    return this.authService.hasRole("Manager");
  }

  isAdmin() :boolean {
    return this.authService.hasRole("Admin");

  }

}
