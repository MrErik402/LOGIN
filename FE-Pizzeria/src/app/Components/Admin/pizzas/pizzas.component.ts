import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Pizza } from '../../../interfaces/pizza';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
declare var bootstrap: any;
@Component({
  selector: 'app-pizzas',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberFormatPipe],
  templateUrl: './pizzas.component.html',
  styleUrl: './pizzas.component.scss'
})
export class PizzasComponent implements OnInit {
  // Lapozóhoz sszükséges változók
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedPizza: Pizza[] = [];

  // Modalokhoz szükséges változók
  formModal: any;
  confirmModal: any;

  editMode = false;

  currency = environment.currency

  pizzas: Pizza[] = [];
  pizza: Pizza = {
    id: 0,
    name: '',
    description: '',
    calory: 0,
    price: 0,
    image: ''
  };

  constructor(
    private api: ApiService,
    private message: MessageService,
  ) { }

  ngOnInit(): void {
    this.formModal = new bootstrap.Modal('#formModal')
    this.confirmModal = new bootstrap.Modal('#confirmModal')
    this.getPizzas();
  }
  getPizzas() {
    this.api.selectAll('pizzas').then(res => {
      this.pizzas = res.data;
      this.totalPages = Math.ceil(this.pizzas.length / this.pageSize);
      this.setPage(1); 
    })
  }
  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedPizza = this.pizzas.slice(startIndex, endIndex);
  }
  getPizza(id: number) {
    this.api.select('pizzas', id).then(res => {
      this.pizza = res.data[0];
      this.editMode = true;
      this.formModal.show();
    })
  }
  save() {
    if (!this.pizza.name || this.pizza.calory <= 0 || this.pizza.price <= 0) {
      this.message.show('warning', 'Figyelem', 'Kérlek töltsd ki a kötelező mezőket! (Megnevezés, Kalória, Ár)');
      return;
    }
    /*Módosítás*/
    if (this.editMode) {
      this.api.selectAll('pizzas/name/eq/' + this.pizza.name).then(res => {
        if (res.data.length != 0 && res.data[0].id != this.pizza.id) {
          this.message.show('warning', 'Figyelem', 'Már létezik ilyen nevű pizza!');
          return;
        }
        this.pizza.image = "";
        this.api.update('pizzas', this.pizza.id, this.pizza).then(res => {
          if (res.status === 200) {
            this.message.show('success', 'Siker', 'Pizza módosítva!');
            this.formModal.hide();
            this.editMode = false;
            this.pizza = {
              id: 0,
              name: '',
              description: '',
              calory: 0,
              price: 0,
              image: ''
            };
            this.getPizzas();
          }
        })
      })
    } else {

      this.api.selectAll('pizzas/name/eq/' + this.pizza.name).then(res => {
        if (res.data.length != 0) {
          this.message.show('warning', 'Figyelem', 'Már létezik ilyen nevű pizza!');
          return;
        }
        this.api.insert('pizzas', this.pizza).then(res => {
          if (res.status === 200) {
            this.message.show('success', 'Siker', 'Pizza hozzáadva!');
            this.formModal.hide();
            this.pizza = {
              id: 0,
              name: '',
              description: '',
              calory: 0,
              price: 0,
              image: ''
            };
            this.getPizzas();
          }
        })
      });
    }
  }
  confirmDelete(id: number) {
    const confirmBtn = document.querySelector('#confirmModal .btn-danger');
    confirmBtn?.addEventListener('click', () => {
      this.delete(id);
    });
    this.confirmModal.show();
  }
  delete(id: number) {
    this.api.delete('pizzas', id).then(res => {
      if (res.status === 200) {
        this.message.show('success', 'Siker', 'Pizza törölve!');
        this.confirmModal.hide();
        this.pizza = {
          id: 0,
          name: '',
          description: '',
          calory: 0,
          price: 0,
          image: ''
        };
        this.getPizzas();
      }
    });
  }

}


