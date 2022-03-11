import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {

  constructor (private authService: AuthService,
    private router:Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.user.pipe(
        take(1),
        map(user => {
            const isAuth = !!user;
            if (isAuth) {
                return user.roles.Manager || user.roles.Admin;
            }
            return this.router.createUrlTree(['auth']);
        }),
        tap(isManager => {
          if(!isManager) {
            console.log("Access denied - Manager / Admin only")
          }
        })
    );
    }
  
}
