import { Routes } from '@angular/router';
import { PizzalistComponent } from './Components/System/pizzalist/pizzalist.component';
import { LoginComponent } from './Components/User/login/login.component';
import { RegistrationComponent } from './Components/User/register/registration.component';
import { NotfoundComponent } from './Components/System/notfound/notfound.component';
import { LostpassComponent } from './Components/User/lostpass/lostpass.component';
import { ProfileComponent } from './Components/User/profile/profile.component';
import { PassmodComponent } from './Components/User/passmod/passmod.component';
import { LogoutComponent } from './Components/User/logout/logout.component';

export const routes: Routes = [
    {path: 'pizzalist', component: PizzalistComponent},
    {path: 'login', component: LoginComponent},
    {path: 'logout', component: LogoutComponent},
    {path: 'register', component: RegistrationComponent},
    {path: 'lostpass', component: LostpassComponent},
    {path: 'user/profile', component: ProfileComponent},
    {path: 'user/passmod', component: PassmodComponent},

    {path: '', redirectTo: 'pizzalist', pathMatch: 'full'},
    {path: '**', component: NotfoundComponent},

];
