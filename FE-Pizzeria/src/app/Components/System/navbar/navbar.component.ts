import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NavItem } from '../../../interfaces/navItem';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

export interface CartItem {
  pizza: any;
  quantity: number;
}

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

export class NavbarComponent implements OnInit, OnDestroy {
  @Input() title = '';

  isLoggedIn = false;
  isAdmin = false
  loggedUserName = '';
  cartItemCount: number = 0;

  private readonly CART_STORAGE_KEY = 'pizzeria_cart';
  private cartCheckInterval: any;

  constructor(
    private auth: AuthService
  ){}

  navItems:NavItem[] = [];

  ngOnInit(): void {
    this.updateCartCount();
    this.auth.isLoggedIn$.subscribe(res => {
      this.isLoggedIn = res;
      this.isAdmin = this.auth.isAdmin()
      if (this.isLoggedIn){
        this.loggedUserName = this.auth.loggedUser()[0].name;
        this.updateCartCount();
      }
      this.setupMenu(res);
    });

    // Ellenőrizzük a kosár tartalmát rendszeresen
    this.cartCheckInterval = setInterval(() => {
      if (this.isLoggedIn) {
        this.updateCartCount();
        this.updateCartBadge();
      }
    }, 1000); // Másodpercenként ellenőrzés

    // Event listener a localStorage változásaira (ha másik tab-ban változik)
    window.addEventListener('storage', (e) => {
      if (e.key === this.CART_STORAGE_KEY) {
        this.updateCartCount();
        this.updateCartBadge();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cartCheckInterval) {
      clearInterval(this.cartCheckInterval);
    }
  }

  updateCartCount(): void {
    const cartData = localStorage.getItem(this.CART_STORAGE_KEY);
    if (cartData) {
      try {
        const cartItems: CartItem[] = JSON.parse(cartData);
        this.cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
      } catch (e) {
        this.cartItemCount = 0;
      }
    } else {
      this.cartItemCount = 0;
    }
  }

  updateCartBadge(): void {
    const cartItem = this.navItems.find(item => item.url === 'cart');
    if (cartItem) {
      cartItem.badge = this.cartItemCount > 0 ? this.cartItemCount : undefined;
    } else if (this.isLoggedIn) {
      // Ha még nincs a menüben, újra beállítjuk
      this.setupMenu(this.isLoggedIn);
    }
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
          badge: this.cartItemCount > 0 ? this.cartItemCount : undefined
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
