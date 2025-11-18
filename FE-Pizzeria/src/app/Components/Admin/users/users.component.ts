import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { Order, OrderItem } from '../../../Interfaces/Order';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
import { environment } from '../../../../environments/environment';

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NumberFormatPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements  OnInit {
  ngOnInit(): void {
    this.userInfoModal = new bootstrap.Modal('#userInfoModal');
    this.orderItemsModal = new bootstrap.Modal('#orderItemsModal');
    this.getUsers();
  }
  constructor(
    private api: ApiService,
    private message: MessageService,
  ) {}
  
  userList: User[] = [];
  startIndex: number = 1;
  endIndex: number = 1;

  /*Pagizáció*/
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedUsers: User[] = [];

  // Modal változók
  userInfoModal: any;
  orderItemsModal: any;
  selectedUser: User | null = null;
  userOrders: Order[] = [];
  
  // Rendelések paginációja
  ordersCurrentPage = 1;
  ordersPageSize = 5;
  ordersTotalPages = 1;
  pagedOrders: Order[] = [];
  ordersStartIndex = 0;
  ordersEndIndex = 0;

  // Rendelés tételek
  selectedOrder: Order | null = null;
  orderItems: OrderItem[] = [];

  currency = environment.currency;

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.startIndex = (page - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.userList.length);
    this.pagedUsers = this.userList.slice(this.startIndex, this.endIndex);
  }

  getUsers() {
    this.api.selectAll('users').then(res => {
      if (res.status === 200) {
        this.userList = res.data;
        this.totalPages = Math.ceil(this.userList.length / this.pageSize);
        this.setPage(1);
      } else {
        this.message.show('danger', 'Hiba', res.message || 'Hiba történt a felhasználók betöltésekor!');
      }
    })
  }

  openUserInfo(user: User) {
    this.selectedUser = user;
    this.userInfoModal.show();
    this.loadUserOrders(user.id!);
  }

  loadUserOrders(userId: number) {
    this.api.selectAll(`orders/user_id/eq/${userId}`).then(res => {
      if (res.status === 200) {
        this.userOrders = res.data;
        this.ordersTotalPages = Math.ceil(this.userOrders.length / this.ordersPageSize);
        this.setOrdersPage(1);
      } else {
        this.userOrders = [];
        this.ordersTotalPages = 1;
        this.setOrdersPage(1);
      }
    });
  }

  setOrdersPage(page: number) {
    if (page < 1 || page > this.ordersTotalPages) return;
    this.ordersCurrentPage = page;
    this.ordersStartIndex = (page - 1) * this.ordersPageSize;
    this.ordersEndIndex = Math.min(this.ordersStartIndex + this.ordersPageSize, this.userOrders.length);
    this.pagedOrders = this.userOrders.slice(this.ordersStartIndex, this.ordersEndIndex);
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

  closeUserInfoModal() {
    this.userInfoModal.hide();
    this.selectedUser = null;
    this.userOrders = [];
    this.ordersCurrentPage = 1;
  }

  closeOrderItemsModal() {
    this.orderItemsModal.hide();
    this.selectedOrder = null;
    this.orderItems = [];
  }
}
