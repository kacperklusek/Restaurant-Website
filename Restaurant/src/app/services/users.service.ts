import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserModel } from '../shared/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = "http://localhost:8000/users"

  constructor(private http: HttpClient) { }

  getUsers() : Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl)
  }

  //getuserrole

  addUser(user: UserModel){    
    this.http.post(this.apiUrl, user)
      .subscribe(user => user);
  }

  updateUser(user:UserModel) :Observable<UserModel>{
    const url = this.apiUrl + '/' + user.id;
    return this.http.post<UserModel>(url, user);
  }

  deleteUser(user: UserModel) :Observable<UserModel>{
    const url = this.apiUrl + '/' + user.id;
    return this.http.delete<UserModel>(url)
  }

  updateUserBanStatus(user: UserModel) :Observable<UserModel> {
    const url = this.apiUrl + '/' + user.id;
    return this.http.post<UserModel>(url, user);
  }


}
