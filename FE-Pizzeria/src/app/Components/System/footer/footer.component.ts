import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})

export class FooterComponent {
  @Input() company = '';
  @Input() author = '';
  year = new Date().getFullYear();
}
