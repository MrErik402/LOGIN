import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { Order, OrderItem } from '../../../Interfaces/Order';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
import { DateFormatPipe } from '../../../pipes/date-format.pipe';
import { environment } from '../../../../environments/environment';
import { User } from '../../../interfaces/user';

declare var bootstrap: any;

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberFormatPipe, DateFormatPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  ngOnInit(): void {
    this.orderItemsModal = new bootstrap.Modal('#orderItemsModal');
    this.getOrders();
  }

  constructor(
    private api: ApiService,
    private message: MessageService,
  ) {}

  orderList: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm: string = '';
  
  startIndex: number = 1;
  endIndex: number = 1;

  /*Pagináció*/
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pagedOrders: Order[] = [];

  // Modal változók
  orderItemsModal: any;
  selectedOrder: Order | null = null;
  orderItems: OrderItem[] = [];
  
  // User adatok tárolása
  usersMap: Map<number, User> = new Map();

  currency = environment.currency;

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.startIndex = (page - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.filteredOrders.length);
    this.pagedOrders = this.filteredOrders.slice(this.startIndex, this.endIndex);
  }

  getOrders() {
    this.api.selectAll('orders').then(res => {
      if (res.status === 200) {
        this.orderList = res.data;
        this.loadUsers();
        this.applySearch();
      } else {
        this.message.show('danger', 'Hiba', res.message || 'Hiba történt a rendelések betöltésekor!');
      }
    });
  }

  loadUsers() {
    // Betöltjük az összes felhasználót a nevek megjelenítéséhez
    this.api.selectAll('users').then(res => {
      if (res.status === 200) {
        res.data.forEach((user: User) => {
          this.usersMap.set(user.id!, user);
        });
      }
    });
  }

  getUserName(userId: number): string {
    const user = this.usersMap.get(userId);
    return user ? user.name : `ID: ${userId}`;
  }

  applySearch() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredOrders = [...this.orderList];
    } else {
      const search = this.searchTerm.toLowerCase().trim();
      this.filteredOrders = this.orderList.filter(order => {
        // Keresés rendelés ID alapján
        if (order.id?.toString().includes(search)) {
          return true;
        }
        
        // Keresés felhasználó név alapján
        const userName = this.getUserName(order.user_id).toLowerCase();
        if (userName.includes(search)) {
          return true;
        }
        
        // Keresés státusz alapján
        if (order.status?.toLowerCase().includes(search)) {
          return true;
        }
        
        // Keresés dátum alapján
        if (order.created_at?.toLowerCase().includes(search)) {
          return true;
        }
        
        // Keresés összeg alapján
        if (order.total?.toString().includes(search)) {
          return true;
        }
        
        return false;
      });
    }
    
    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
    this.setPage(1);
  }

  onSearchChange() {
    this.applySearch();
  }

  openOrderItems(order: Order) {
    this.selectedOrder = order;
    this.loadOrderItems(order.id!);
    this.orderItemsModal.show();
  }

  loadOrderItems(orderId: number) {
    this.api.selectAll(`order_items/order_id/eq/${orderId}`).then(res => {
      if (res.status === 200) {
        this.orderItems = res.data;
        // Ha van pizza_id, betöltjük a pizza adatokat is
        this.orderItems.forEach(item => {
          if (item.pizza_id) {
            this.api.select('pizzas', item.pizza_id).then(pizzaRes => {
              if (pizzaRes.status === 200 && pizzaRes.data && pizzaRes.data.length > 0) {
                item.pizza = pizzaRes.data[0];
              }
            });
          }
        });
      } else {
        this.orderItems = [];
      }
    });
  }

  closeOrderItemsModal() {
    this.orderItemsModal.hide();
    this.selectedOrder = null;
    this.orderItems = [];
  }

  updateOrderStatus(order: Order, newStatus: string) {
    const updatedOrder = { ...order, status: newStatus };
    this.api.update('orders', order.id!, updatedOrder).then(res => {
      if (res.status === 200) {
        this.message.show('success', 'Siker', 'Rendelés státusza frissítve!');
        this.getOrders();
      } else {
        this.message.show('danger', 'Hiba', res.message || 'Hiba történt a státusz frissítésekor!');
      }
    });
  }
}
