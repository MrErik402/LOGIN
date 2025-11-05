import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../interfaces/user';
import {FormsModule} from '@angular/forms'
import { MessageService } from '../../../services/message.service';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  acceptTerms: boolean = false;
  newUser: User = {
      name: '',
      email: '',
      password: '',
      confirm: '',
      role: 'user'
  }

  constructor(
    private api:ApiService,
    private message: MessageService,
    private router: Router,
  ){}
  register(){
    if(!this.acceptTerms){
      this.message.show('warning', "Hiba", 'Nem fogadtad el a szerződési feltételeket!');
      return;
    }
    /*if(!this.newUser.name || !this.newUser.email || !this.newUser.password || !this.newUser.confirm){
      this.message.show('warning', 'Hiba', 'Nem töltöttél ki minden kötelező adatot!');
      return;
    }
    if (this.newUser.password != this.newUser.confirm) {
      this.message.show('danger', 'HIBA!', 'Nem egyezik meg a két általad megadott jelszó!');
      return;
    }*/

    this.api.registration("users", this.newUser).then(res => {
      if(res.status == 500){
        this.message.show('warning', 'FIGYELMEZTETÉS!', res.message)
        return
      }
      this.message.show('success', 'OK!', res.message);
      this.router.navigate(['/login'])
    });
  }
}
