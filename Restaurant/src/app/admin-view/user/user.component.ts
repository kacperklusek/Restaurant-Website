import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { UserModel } from 'src/app/shared/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @Input() user! :UserModel;
  isLoading: boolean = false;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
  }

  onBanUser() {
    this.user.banned = true;
    this.usersService.updateUserBanStatus(this.user)
      .subscribe(user => {
        console.log("user banned", user);
        
      });
  }

  onUnbanUser() {
    this.user.banned = false;
    this.usersService.updateUserBanStatus(this.user)
      .subscribe(user => {
        console.log("user unbanned", user);
        
      });
  }

  onChange(target: any) {    
    // if (target.checked) {
    //   //@ts-ignore
    //   this.user.roles[target.value] = false;
    // } else {
    //   this.user.roles = this.user.roles.filter(role => role !== target.value)
    // }
    //@ts-ignore
    this.user.roles[target.value] = ! this.user.roles[target.value];


    console.log(this.user.roles);
    
    this.isLoading = true;
    this.usersService.updateUser(this.user).subscribe((user) => {
      this.isLoading = false;
      console.log("updated user roles: ", user)
    })
  }

}
