import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { Pizza } from '../../../interfaces/pizza';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { environment } from '../../../../environments/environment';

export interface CartItem {
  pizza: Pizza;
  quantity: number;
}

@Component({
  selector: 'app-pizzalist',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberFormatPipe, LightboxComponent],
  templateUrl: './pizzalist.component.html',
  styleUrl: './pizzalist.component.scss'
})
export class PizzalistComponent implements OnInit {
  ngOnInit(): void {
    this.getPizzas();
  }

  constructor(
    private api: ApiService,
    private message: MessageService,
    private auth: AuthService
  ) {}

  pizzas: Pizza[] = [];
  filteredPizzas: Pizza[] = [];
  searchTerm: string = '';
  
  serverUrl = environment.serverUrl;
  currency = environment.currency;
  lightboxVisible: boolean = false;
  lightboxImageUrl: string = '';

  startIndex: number = 1;
  endIndex: number = 1;

  /*Pagináció*/
  currentPage = 1;
  pageSize = 9; // 3x3 grid
  totalPages = 1;
  pagedPizzas: Pizza[] = [];

  private readonly CART_STORAGE_KEY = 'pizzeria_cart';

  getPizzas() {
    this.api.selectAll('pizzas').then(res => {
      if (res.status === 200) {
        this.pizzas = res.data;
        this.applySearch();
      } else {
        this.message.show('danger', 'Hiba', res.message || 'Hiba történt a pizzák betöltésekor!');
      }
    });
  }

  applySearch() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredPizzas = [...this.pizzas];
    } else {
      const search = this.searchTerm.toLowerCase().trim();
      this.filteredPizzas = this.pizzas.filter(pizza => {
        return pizza.name.toLowerCase().includes(search) ||
               pizza.description?.toLowerCase().includes(search) ||
               pizza.calory.toString().includes(search) ||
               pizza.price.toString().includes(search);
      });
    }
    
    this.totalPages = Math.ceil(this.filteredPizzas.length / this.pageSize);
    this.setPage(1);
  }

  onSearchChange() {
    this.applySearch();
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.startIndex = (page - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.filteredPizzas.length);
    this.pagedPizzas = this.filteredPizzas.slice(this.startIndex, this.endIndex);
  }

  addToCart(pizza: Pizza) {
    if (!this.auth.isLoggedUser()) {
      this.message.show('warning', 'Figyelmeztetés', 'A kosár használatához be kell jelentkezned!');
      return;
    }

    const cartData = localStorage.getItem(this.CART_STORAGE_KEY);
    let cartItems: CartItem[] = cartData ? JSON.parse(cartData) : [];

    // Ellenőrizzük, hogy van-e már ilyen pizza a kosárban
    const existingItemIndex = cartItems.findIndex(item => item.pizza.id === pizza.id);
    
    if (existingItemIndex >= 0) {
      // Ha van, növeljük a mennyiséget
      cartItems[existingItemIndex].quantity += 1;
      this.message.show('success', 'Siker', `${pizza.name} mennyisége frissítve a kosárban!`);
    } else {
      // Ha nincs, hozzáadjuk
      cartItems.push({
        pizza: pizza,
        quantity: 1
      });
      this.message.show('success', 'Siker', `${pizza.name} hozzáadva a kosárhoz!`);
    }

    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cartItems));
  }

  openLightBox(imageFilename: string | undefined) {
    if (!imageFilename) return;
    this.lightboxImageUrl = this.serverUrl + `/uploads/${imageFilename}`;
    this.lightboxVisible = true;
  }
}
