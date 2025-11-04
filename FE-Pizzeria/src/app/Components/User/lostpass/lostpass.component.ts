import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../Services/api.service';

@Component({
  selector: 'app-lostpass',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lostpass.component.html',
  styleUrl: './lostpass.component.scss'
})
export class LostpassComponent {
  constructor(private api:ApiService){}
  send(){

  }
}
