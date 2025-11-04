import { Component, Input, OnInit } from '@angular/core';
import { NavItem } from '../../../Interfaces/NavItem';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, NgFor],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent  implements OnInit{
  @Input() title = '';

  constructor (
    private auth: AuthService
  ){}

  navItems:NavItem[] = []

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(res =>{
      this.setupMenu(res);
    });
    
  }

  setupMenu(isLoggedIn: boolean){
    this.navItems = [
      {
        name: 'Pizzalista',
        url: 'pizzalist',
        icon: 'pizza.png'
      },
      ...(isLoggedIn) ? [
        {
          name: 'Kilépés',
          url: 'logout',
          icon: 'logout.png'
        },
      ]:[
      {
        name: 'Regisztráció',
        url: 'register',
        icon: 'register.png'
      },
      {
        name: 'Belépés',
        url: 'login',
        icon: 'login.png'
      }]
      
    ]
  }
}
