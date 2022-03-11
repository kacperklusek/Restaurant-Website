import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { WebApiKeyService } from "src/assets/webApiKeyService";
import { Roles, User } from "../shared/user.model";
import { UsersService } from "./users.service";

export interface AuthResponseData {
idToken: string,
email: string,
refreshToken : string
expiresIn:string,
localId:string,
registered?: boolean
}

interface UserData {
    roles: Roles,
    boughtDishes: string[],
    banned: boolean
}


@Injectable({
    providedIn: "root",
})
export class AuthService {
    user = new BehaviorSubject<User|null>(null);
    private tokenExpirationTimeout :any;
    
    webApiKey: string;

    // @ts-ignore
    loginPersistence:string = localStorage.getItem("loginPersistence") !== null ? localStorage.getItem("loginPersistence") : "Session";
    
    usersUrl = "http://localhost:8000/users"

    constructor(private http:HttpClient,
        private router: Router,
        private usersService :UsersService,
        webApiKeyService: WebApiKeyService) 
        { 
            this.webApiKey = webApiKeyService.key; // that's the fastest and only way to get 
            // the key from outside of this file, in order to hide it from git
        }

    signup(email: string, password:string) {
        return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + this.webApiKey,
        {
            email: email,
            password: password,
            returnSecureToken: true,
        }
        ).pipe(catchError(this.handleError),
        tap( resData =>  {
            const userRoles = {Customer: true, Manager:false, Admin: false} // by default setting role to Customer            
            this.usersService.addUser({ id: resData.localId, email: resData.email, roles: userRoles, boughtDishes: [], banned: false});
            this.handleAuthentication(
                userRoles,
                resData.email, 
                resData.localId,
                resData.idToken,
                +resData.expiresIn,
                [],
                false);
                }),
            
        );
    }

    login(email:string, password:string) {
        return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + this.webApiKey,
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
        ).pipe(catchError(this.handleError),
            tap(resData => {                
                this.http.get<UserData>(this.usersUrl + '/' + resData.localId)
                    .subscribe((userData :UserData) => {
                        this.handleAuthentication(
                            userData.roles,
                            resData.email, 
                            resData.localId,
                            resData.idToken,
                            +resData.expiresIn,
                            userData.boughtDishes,
                            userData.banned);
                    })  
            }));
    }

    autoLogin() {        
        if (!this.checkPersistence()) {
            return;
        }
        console.log("autologged");
        
        //@ts-ignore   here i have checked if data stored in the browser is not null
        const userData = JSON.parse(this.checkPersistence());
        

        const loadedUser = new User(
            userData.roles,
            userData.email,
            userData.id, 
            userData._token,
            new Date(userData._tokenExpirationDate),
            userData.boughtDishes,
            userData.banned
            );

        if (loadedUser.token) {            
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();            
            this.autoLogout(expirationDuration);            
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        this.handleLogoutPersistence();
        if (this.tokenExpirationTimeout) {
            clearTimeout(this.tokenExpirationTimeout);
            this.tokenExpirationTimeout = null;
        }
        console.log('logout');
    }

    autoLogout(expirationDuration: number) {        
        this.tokenExpirationTimeout = setTimeout(() => {
            this.logout()
        }, expirationDuration); 
    }

    private handleAuthentication(roles :Roles ,email:string, userId:string, token:string, expiresIn:number, boughtDishes:string[], banned: boolean) {        
        const expirationDate = new Date(new Date().getTime() + +expiresIn*1000);
        const user = new User(roles, email, userId, token, expirationDate, boughtDishes, banned);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        this.handleLoginPersistence(user);
        
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'an unknown error occured';
            if (!errorRes.error || !errorRes.error.error) {
                return throwError(() => new Error(errorMessage));
            }
            switch (errorRes.error.error.message) {
                case "EMAIL_EXISTS" :
                    errorMessage = "this email already exists";
                    break;
                case "EMAIL_NOT_FOUND" :
                    errorMessage = "this email is not registered";
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = "invalid password";
                    break;
            }
            return throwError(() => new Error(errorMessage));
    }

    private checkPersistence() : null|any { //returns null|AuthResponseData that is stored in local/sessionStorage
        switch (this.loginPersistence) {
            case "None": return null;
            case "Session": return sessionStorage.getItem("userData");
            case "Local": return localStorage.getItem("userData");
        }
    }

    private handleLoginPersistence(user:User) { //login , autologin, handleauthentication
        switch (this.loginPersistence) {
            case "None": return;
            case "Session": {
                sessionStorage.setItem('userData', JSON.stringify(user));
                return;
            }
            case "Local":{
                localStorage.setItem('userData', JSON.stringify(user));
                return;
            }
        }
    }

    private handleLogoutPersistence() {
        switch (this.loginPersistence) {
            case "None": return;
            case "Session": {
                sessionStorage.removeItem("userData");
                return
            }
            case "Local": {
                localStorage.removeItem("userData");
                return;
            }
        }
    }

    updatePersistencePolicy() {
        localStorage.setItem("loginPersistence", this.loginPersistence);

        switch (this.loginPersistence) {
            case "None": {
                sessionStorage.removeItem("userData");
                localStorage.removeItem("userData");
                break;
            };
            case "Session": {
                localStorage.removeItem("userData");
                sessionStorage.setItem('userData', JSON.stringify(this.user.value));
                break;
            }
            case "Local": {
                sessionStorage.removeItem("userData");
                localStorage.setItem('userData', JSON.stringify(this.user.value));
                break;
            }
        }
    }


    hasRole(role:string) :boolean {
        if (this.user) {
            //@ts-ignore
            return !!this.user.value?.roles[role];
        }
        return false
    }
   
}