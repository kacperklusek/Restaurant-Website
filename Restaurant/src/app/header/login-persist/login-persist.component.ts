import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-persist',
  templateUrl: './login-persist.component.html',
  styleUrls: ['./login-persist.component.css']
})
export class LoginPersistComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  handleChange() {
    this.authService.updatePersistencePolicy();
  }

}
