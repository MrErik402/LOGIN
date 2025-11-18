import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { Order, OrderItem } from '../../../Interfaces/Order';
import { User } from '../../../interfaces/user';
import { Pizza } from '../../../interfaces/pizza';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, NumberFormatPipe],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  ngOnInit(): void {
    this.loadStats();
  }

  constructor(
    private api: ApiService,
    private message: MessageService
  ) {}

  currency = environment.currency;

  // Statisztikák
  totalOrders: number = 0;
  totalRevenue: number = 0;
  totalUsers: number = 0;
  totalPizzas: number = 0;
  activeUsers: number = 0;
  pendingOrders: number = 0;
  completedOrders: number = 0;
  cancelledOrders: number = 0;
  averageOrderValue: number = 0;

  // Top statisztikák
  topPizzas: { pizza: Pizza; quantity: number; revenue: number }[] = [];
  topUsers: { user: User; orderCount: number; totalSpent: number }[] = [];

  // Dátum statisztikák
  todayOrders: number = 0;
  todayRevenue: number = 0;
  thisMonthOrders: number = 0;
  thisMonthRevenue: number = 0;

  loading: boolean = true;

  loadStats() {
    this.loading = true;
    Promise.all([
      this.loadOrders(),
      this.loadUsers(),
      this.loadPizzas()
    ]).then(() => {
      this.calculateStats();
      this.loading = false;
    });
  }

  async loadOrders() {
    const res = await this.api.selectAll('orders');
    if (res.status === 200) {
      const orders: Order[] = res.data;
      this.totalOrders = orders.length;
      
      // Összes bevétel
      this.totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      // Átlagos rendelés érték
      this.averageOrderValue = this.totalOrders > 0 ? this.totalRevenue / this.totalOrders : 0;
      
      // Státusz szerinti számolás
      this.pendingOrders = orders.filter(o => o.status === 'pending' || !o.status).length;
      this.completedOrders = orders.filter(o => o.status === 'completed').length;
      this.cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
      
      // Dátum szerinti statisztikák
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      this.todayOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at || 0);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      }).length;
      
      this.todayRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.created_at || 0);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime();
        })
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      this.thisMonthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at || 0);
        return orderDate >= thisMonth;
      }).length;
      
      this.thisMonthRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.created_at || 0);
          return orderDate >= thisMonth;
        })
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      // Top felhasználók
      await this.calculateTopUsers(orders);
      
      // Top pizzák
      await this.calculateTopPizzas();
    }
  }

  async loadUsers() {
    const res = await this.api.selectAll('users');
    if (res.status === 200) {
      const users: User[] = res.data;
      this.totalUsers = users.length;
      this.activeUsers = users.filter(u => u.status).length;
    }
  }

  async loadPizzas() {
    const res = await this.api.selectAll('pizzas');
    if (res.status === 200) {
      this.totalPizzas = res.data.length;
    }
  }

  async calculateTopUsers(orders: Order[]) {
    const userStats = new Map<number, { orderCount: number; totalSpent: number }>();
    
    // Számoljuk ki felhasználónként
    orders.forEach(order => {
      const userId = order.user_id;
      if (!userStats.has(userId)) {
        userStats.set(userId, { orderCount: 0, totalSpent: 0 });
      }
      const stats = userStats.get(userId)!;
      stats.orderCount++;
      stats.totalSpent += order.total || 0;
    });
    
    // Betöltjük a felhasználó adatokat és rendezzük
    const topUsersArray: { user: User; orderCount: number; totalSpent: number }[] = [];
    
    for (const [userId, stats] of userStats.entries()) {
      const userRes = await this.api.select('users', userId);
      if (userRes.status === 200 && userRes.data && userRes.data.length > 0) {
        topUsersArray.push({
          user: userRes.data[0],
          orderCount: stats.orderCount,
          totalSpent: stats.totalSpent
        });
      }
    }
    
    this.topUsers = topUsersArray
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  }

  async calculateTopPizzas() {
    const res = await this.api.selectAll('order_items');
    if (res.status === 200) {
      const orderItems: OrderItem[] = res.data;
      const pizzaStats = new Map<number, { quantity: number; revenue: number }>();
      
      // Számoljuk ki pizzánként
      orderItems.forEach(item => {
        const pizzaId = item.pizza_id;
        if (!pizzaStats.has(pizzaId)) {
          pizzaStats.set(pizzaId, { quantity: 0, revenue: 0 });
        }
        const stats = pizzaStats.get(pizzaId)!;
        stats.quantity += item.quantity;
        stats.revenue += (item.price || 0) * item.quantity;
      });
      
      // Betöltjük a pizza adatokat és rendezzük
      const topPizzasArray: { pizza: Pizza; quantity: number; revenue: number }[] = [];
      
      for (const [pizzaId, stats] of pizzaStats.entries()) {
        const pizzaRes = await this.api.select('pizzas', pizzaId);
        if (pizzaRes.status === 200 && pizzaRes.data && pizzaRes.data.length > 0) {
          topPizzasArray.push({
            pizza: pizzaRes.data[0],
            quantity: stats.quantity,
            revenue: stats.revenue
          });
        }
      }
      
      this.topPizzas = topPizzasArray
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
    }
  }

  calculateStats() {
    // További számítások ha szükséges
  }
}
