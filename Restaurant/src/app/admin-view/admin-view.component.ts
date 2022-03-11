import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from '../services/users.service';
import { User, UserModel } from '../shared/user.model';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit, OnDestroy{
  users: UserModel[] = [];
  usersSubscription!: Subscription;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersSubscription = this.usersService.getUsers()
      .subscribe(users => {
        this.users = users;
      })
  }

  ngOnDestroy(): void {
      this.usersSubscription.unsubscribe();      
  }

}
