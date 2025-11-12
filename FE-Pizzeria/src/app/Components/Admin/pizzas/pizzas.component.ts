import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Pizza } from '../../../interfaces/pizza';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
import { LightboxComponent } from '../../System/lightbox/lightbox.component';
declare var bootstrap: any;
@Component({
  selector: 'app-pizzas',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberFormatPipe, LightboxComponent],
  templateUrl: './pizzas.component.html',
  styleUrl: './pizzas.component.scss'
})
export class PizzasComponent implements OnInit {
  serverUrl = environment.serverUrl;
  lightboxVisible: boolean = false;
  lightboxImageUrl: string = '';

  startIndex: number = 1;
  endIndex: number = 1;

  // Lapozóhoz sszükséges változók
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedPizza: Pizza[] = [];

  selectedFile: File | null = null;


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
    this.startIndex = (page - 1) * this.pageSize;
    this.endIndex = this.startIndex + this.pageSize;
    this.pagedPizza = this.pizzas.slice(this.startIndex, this.endIndex);
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
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile); /*Az első 'image' a backendbe megadottnak kell lennie.*/
      this.api.upload(formData).then(res => {
        if (res.status != 200) {
          this.message.show('danger', 'Hiba', res.message || 'Hiba a fájl feltöltése során!');
          return;
        }
        this.pizza.image = res.data.filename;

      })
    }
    /*Módosítás*/
    if (this.editMode) {
      this.api.selectAll('pizzas/name/eq/' + this.pizza.name).then(res => {
        if (res.data.length != 0 && res.data[0].id != this.pizza.id) {
          this.message.show('warning', 'Figyelem', 'Már létezik ilyen nevű pizza!');
          return;
        }
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
    let imagedPizza = this.pizzas.find(p => p.image != '' && p.id === id);
    if (imagedPizza && imagedPizza.image != '') this.api.deleteImage(imagedPizza.image!)

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
  cancel(){
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
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  DeleteImage(filename: string | undefined) {
    if (!filename) {
      this.message.show('warning', 'Figyelem', 'Nincs törölhető kép!');
      return;
    }
    this.api.deleteImage(filename).then(res => {
      if (res.status === 200) {
        this.api.update('pizzas', this.pizza.id, this.pizza).then(res => {
          if (res.status === 200) {
            this.getPizzas();
            this.message.show('success', 'Siker', 'Kép törölve!');
            this.pizza.image = '';
            this.selectedFile = null;
          }

        });

      } else {
        this.message.show('danger', 'Hiba', res.message || 'Hiba a kép törlése során!');
      }
    });

  }
  openLightBox(imageFilename: string | undefined) {
    this.lightboxImageUrl = environment.serverUrl + `/uploads/${imageFilename}`;
    this.lightboxVisible = true;
  }
}


