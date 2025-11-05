import { Routes } from '@angular/router';
import { NotfoundComponent } from './Components/System/notfound/notfound.component';
import { PizzalistComponent } from './Components/System/pizzalist/pizzalist.component';
import { LoginComponent } from './Components/User/login/login.component';
import { LogoutComponent } from './Components/User/logout/logout.component';
import { RegistrationComponent } from './Components/User/register/registration.component';
import { ProfileComponent } from './Components/User/profile/profile.component';
import { CartComponent } from './Components/User/cart/cart.component';
import { StatsComponent } from './Components/Admin/stats/stats.component';
import { PizzasComponent } from './Components/Admin/pizzas/pizzas.component';
import { OrdersComponent } from './Components/Admin/orders/orders.component';
import { UsersComponent } from './Components/Admin/users/users.component';
import { MyordersComponent } from './Components/User/myorders/myorders.component';


export const routes: Routes = [
  { path: 'pizzalist', component: PizzalistComponent},
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'cart', component: CartComponent },
  {path: 'myorders', component: MyordersComponent},

  { path: 'users', component: UsersComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'pizzas', component: PizzasComponent },
  { path: 'stats', component: StatsComponent },

  { path: '', redirectTo: '/pizzalist', pathMatch: 'full'},
  { path: '**', component: NotfoundComponent},
];
