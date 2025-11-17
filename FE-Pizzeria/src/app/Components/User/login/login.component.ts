import { Component } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { User } from '../../../interfaces/user';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  user: User = {
    name: '',
    email: '',
    password: '',
    role: '',
    status: true
  }
  rememberMe: boolean = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private message: MessageService,
    private router: Router,
  ){}

  login(){
    this.api.login('users', this.user).then(res => {
      if (res.status == 500){
        this.message.show('danger', 'Hiba', res.message);
        return;
      }
      //Maradjon bejelentkezve vagy sem
      if(this.rememberMe){
        this.auth.storeUser(JSON.stringify(res.data));
      }

      this.auth.login(JSON.stringify(res.data));
      this.router.navigate(['/pizzalist'])
    });
  }

}
