import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { enviroment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   
  private tokenName = enviroment.tokenName;
  private isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedIn.asObservable();
  constructor() { }

  hasToken():boolean{
    if(sessionStorage.getItem(this.tokenName)){
      return true;
    }
    return false;
  }

  login(token:string){
    sessionStorage.setItem(this.tokenName, token)
    this.isLoggedIn.next(true)

  }
  logout(){
    sessionStorage.removeItem(this.tokenName);
    this.isLoggedIn.next(false)
  }
  loggedUser(){ //A bejelentkezett felhasználó adatai
    const token = sessionStorage.getItem(this.tokenName)
    if(token){
      return JSON.parse(token)
    }
    return null
  }
  isAdmin():boolean{ //Admin-e a felhasználó
    const user = this.loggedUser();
    return user.role === 'admin'
  }
  isLoggedUser():boolean{ //Bárki be van-e jelentkezve
    return this.isLoggedIn.value
  }
}
