import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Components/System/header/header.component';
import { NavbarComponent } from './Components/System/navbar/navbar.component';
import { FooterComponent } from './Components/System/footer/footer.component';
import { MessageComponent } from './Components/System/message/message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavbarComponent,MessageComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Türr Pizzéria';
  subtitle = 'Ha megéhezel programozás közben! :)';
  company = 'Bajai SZC Türr István Technikum';
  author = '13.A Szoftverfejlesztő - Echo';
}
