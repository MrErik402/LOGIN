import { Component, Input, OnInit } from '@angular/core';
import { NavItem } from '../../../interfaces/navItem';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit {
  @Input() title = '';

  isLoggedIn = false;
  isAdmin = false
  loggedUserName = '';

  constructor(
    private auth: AuthService
  ){}

  navItems:NavItem[] = [];

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(res => {
      this.isLoggedIn = res;
      this.isAdmin=this.auth.isAdmin()
      if (this.isLoggedIn){
        this.loggedUserName = this.auth.loggedUser()[0].name;
      }
      this.setupMenu(res);
    });
  }

  setupMenu(isLoggedIn: boolean){
    this.navItems = [
      {
        name: 'Pizzalista',
        url: 'pizzalist',
        icon: 'bi-card-list'
      },

      ...(isLoggedIn) ? [
        {
          name: 'Kosár',
          url: 'cart',
          icon: 'bi-cart',
          badge: 10
        },
        ...(this.isAdmin) ? [
          {
            name: 'Pizzák kezelése',
            url: 'pizzas',
            icon: 'bi-database'
          },
          {
            name: 'Felhasználók kezelése',
            url: 'users',
            icon: 'bi-people-fill'
          },
          {
            name: 'Rendelések kezelése',
            url: 'orders',
            icon: 'bi-receipt'
          },
          {
            name: 'Statisztika',
            url: 'stats',
            icon: 'bi-graph-up-arrow'
          }
        ]:[
          {
            name: 'Rendeléseim',
            url: 'myorders',
            icon: 'bi-receipt'
          }
        ],
        {
          name: 'Profilom',
          url: 'profile',
          icon: 'bi-person-circle'
        },
        {
          name: 'Kilépés',
          url: 'logout',
          icon: 'bi-box-arrow-left'
        },
      ] : [
        {
          name: 'Regisztráció',
          url: 'registration',
          icon: 'bi-person-add'
        },
        {
          name: 'Belépés',
          url: 'login',
          icon: 'bi-box-arrow-right'
        },
      ]

    ]
  }

}
