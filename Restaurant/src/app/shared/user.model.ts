export interface Roles {
    Customer: boolean,
    Manager: boolean,
    Admin: boolean,
}

export interface UserModel {
    id: string,
    email: string,
    roles: Roles,
    banned: boolean,
    boughtDishes: String[]
}

export class User implements UserModel {

    constructor(
        public roles: Roles,
        public email: string,
        public id:string,
        private _token:string,
        private _tokenExpirationDate:Date,
        public boughtDishes: String[],
        public banned:boolean
        ) 
    {

    }


    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
            return null;
        }        
        return this._token;
    }
}