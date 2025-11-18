import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { Order, OrderItem } from '../../../Interfaces/Order';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
import { DateFormatPipe } from '../../../pipes/date-format.pipe';
import { environment } from '../../../../environments/environment';

declare var bootstrap: any;

@Component({
  selector: 'app-myorders',
  standalone: true,
  imports: [CommonModule, RouterModule, NumberFormatPipe, DateFormatPipe],
  templateUrl: './myorders.component.html',
  styleUrl: './myorders.component.scss'
})
export class MyordersComponent implements OnInit {
  ngOnInit(): void {
    const user = this.auth.loggedUser();
    if (!user || !user[0]) {
      this.message.show('warning', 'Figyelmeztetés', 'Be kell jelentkezned a rendeléseid megtekintéséhez!');
      return;
    }
    this.userId = user[0].id!;
    this.orderItemsModal = new bootstrap.Modal('#orderItemsModal');
    this.getMyOrders();
  }

  constructor(
    private api: ApiService,
    private message: MessageService,
    private auth: AuthService
  ) {}

  orderList: Order[] = [];
  userId: number = 0;
  
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

  currency = environment.currency;

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.startIndex = (page - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.orderList.length);
    this.pagedOrders = this.orderList.slice(this.startIndex, this.endIndex);
  }

  getMyOrders() {
    if (!this.userId) return;
    
    this.api.selectAll(`orders/user_id/eq/${this.userId}`).then(res => {
      if (res.status === 200) {
        // Rendezzük dátum szerint csökkenő sorrendben (legújabb elöl)
        this.orderList = res.data.sort((a: Order, b: Order) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
        this.totalPages = Math.ceil(this.orderList.length / this.pageSize);
        this.setPage(1);
      } else {
        this.message.show('danger', 'Hiba', res.message || 'Hiba történt a rendelések betöltésekor!');
      }
    });
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

  getStatusBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'processing':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'completed':
        return 'Kész';
      case 'processing':
        return 'Feldolgozás alatt';
      case 'cancelled':
        return 'Törölve';
      default:
        return 'Függőben';
    }
  }
}
