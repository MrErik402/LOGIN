import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../Services/api.service';
import { MessageService } from '../../../Services/message.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../../Interfaces/User';
import { AuthService } from '../../../Services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private api:ApiService, private message: MessageService, private router: Router, private auth: AuthService){}
  user:User = {
    name: '',
    email: '',
    password: '',
    role: ''
  }
  login(){
    this.api.login('users', this.user).then(res =>{
      if(res.status == 500){
        this.message.show('warning', 'FIGYELMEZTETÉS!', res.message)
        return
      }else{
        this.message.show('success', 'OK!', res.message)
        this.auth.login(JSON.stringify(res.data))
      }
    })
  }
}
