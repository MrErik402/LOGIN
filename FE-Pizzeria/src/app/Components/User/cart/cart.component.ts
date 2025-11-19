import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { Pizza } from '../../../interfaces/pizza';
import { Order, OrderItem } from '../../../Interfaces/Order';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
import { environment } from '../../../../environments/environment';

export interface CartItem {
  pizza: Pizza;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberFormatPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  ngOnInit(): void {
    this.loadCart();
    const user = this.auth.loggedUser();
    if (!user || !user[0]) {
      this.message.show('warning', 'Figyelmeztetés', 'A kosár használatához be kell jelentkezned!');
      this.router.navigate(['/login']);
      return;
    }
    this.userId = user[0].id!;
  }

  constructor(
    private api: ApiService,
    private message: MessageService,
    private auth: AuthService,
    private router: Router
  ) {}

  cartItems: CartItem[] = [];
  userId: number = 0;
  currency = environment.currency;
  serverUrl = environment.serverUrl;

  private readonly CART_STORAGE_KEY = 'pizzeria_cart';

  loadCart() {
    const cartData = localStorage.getItem(this.CART_STORAGE_KEY);
    if (cartData) {
      try {
        this.cartItems = JSON.parse(cartData);
      } catch (e) {
        this.cartItems = [];
        localStorage.removeItem(this.CART_STORAGE_KEY);
      }
    }
  }

  saveCart() {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cartItems));
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.pizza.price * item.quantity);
    }, 0);
  }

  updateQuantity(index: number, quantity: number) {
    if (quantity < 1) {
      this.removeItem(index);
      return;
    }
    if (quantity > 99) {
      this.message.show('warning', 'Figyelem', 'Maximum 99 db rendelhető egy termékből!');
      return;
    }
    this.cartItems[index].quantity = quantity;
    this.saveCart();
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.saveCart();
    if (this.cartItems.length === 0) {
      localStorage.removeItem(this.CART_STORAGE_KEY);
    }
  }

  clearCart() {
    this.cartItems = [];
    localStorage.removeItem(this.CART_STORAGE_KEY);
  }

  placeOrder() {
    if (this.cartItems.length === 0) {
      this.message.show('warning', 'Figyelem', 'A kosár üres!');
      return;
    }

    if (!this.userId) {
      this.message.show('warning', 'Figyelem', 'Be kell jelentkezned a rendeléshez!');
      this.router.navigate(['/login']);
      return;
    }

    const total = this.getTotal();

    // Létrehozzuk a rendelést
    const newOrder: Order = {
      user_id: this.userId,
      total: total,
      status: 'pending'
    };

    this.api.insert('orders', newOrder).then(res => {
      if (res.status === 200 && res.data && res.data.insertId) {
        const orderId = res.data.insertId;

        // Hozzáadjuk a rendelés tételeket
        const orderItemsPromises = this.cartItems.map(item => {
          const orderItem: OrderItem = {
            order_id: orderId,
            pizza_id: item.pizza.id,
            quantity: item.quantity,
            price: item.pizza.price
          };
          return this.api.insert('order_items', orderItem);
        });

        Promise.all(orderItemsPromises).then(results => {
          const allSuccess = results.every(r => r.status === 200);
          if (allSuccess) {
            this.message.show('success', 'Siker', 'Rendelésed sikeresen leadva!');
            this.clearCart();
            this.router.navigate(['/myorders']);
          } else {
            this.message.show('danger', 'Hiba', 'Hiba történt a rendelés tételek hozzáadása során!');
          }
        });
      } else {
        this.message.show('danger', 'Hiba', res.message || 'Hiba történt a rendelés leadása során!');
      }
    });
  }
}
