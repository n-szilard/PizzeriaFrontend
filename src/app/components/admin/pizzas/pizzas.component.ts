import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { Pizza } from '../../../interfaces/pizza';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { NumberFormatPipe } from "../../../pipes/number-format.pipe";
import { LightboxComponent } from '../../system/lightbox/lightbox.component';

declare var bootstrap: any;

@Component({
  selector: 'app-pizzas',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberFormatPipe, LightboxComponent],
  templateUrl: './pizzas.component.html',
  styleUrl: './pizzas.component.scss'
})
export class PizzasComponent implements OnInit {
  
  lightboxVisible = false;
  lightboxImage = '';
  
  formModal: any;
  confirmModal: any;
  editMode: boolean = false;
  
  selectedFile: File | null = null;
  
  // lapozo valtozok
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedPizzas: Pizza[] = [];
  pizzas: Pizza[] = [];
  
  newPizza: Pizza = {
    id: 0,
    name: '',
    description: '',
    image: '',
    calory: 0,
    price: 0
  }

  currency = 'Ft';

  constructor(
    private api: ApiService,
    private message: MessageService,
  ) { }

  ngOnInit(): void {
    this.formModal = new bootstrap.Modal('#staticBackdrop')
    this.confirmModal = new bootstrap.Modal('#confirmModal')
    this.getPizzas();
    this.setPage(1);
  }

  getPizzas() {
    this.api.selectAll('pizzas').then(res => {
      this.pizzas = res.data;
      this.totalPages = Math.ceil(this.pizzas.length / this.pageSize)
    })
  }

  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedPizzas = this.pizzas.slice(startIndex, endIndex);
  }

  getPizza(id: number) {
    this.api.selectOne('pizzas', id).then(res => {
      this.newPizza = res.data[0];
      this.editMode = true;
      this.formModal.show();
    })
  }

  async save() {
    if (!this.newPizza.name || !this.newPizza.price || !this.newPizza.calory) {
      this.message.show('danger', 'Hiba', 'Nem adtál meg minden kötelező adatot!');
      return;
    }

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      await this.api.upload(formData).then(res => {
        if (res.status != 200) {
          this.message.show('danger', 'Hiba', res.data.message)
        }

        this.newPizza.image = res.data.filename;
      });
    }

    if (this.editMode) {
      this.api.selectAll('pizzas/name/eq/' + this.newPizza.name).then( res => {
        if (res.data.length != 0) {
          this.message.show('danger', 'Hiba', 'Van már ilyen nevű pizza!');
          return;
        }

        this.newPizza.image = '';

        this.api.update('pizzas', this.newPizza.id, this.newPizza).then(res => {
          this.message.show('success', 'Ok', 'A pizza módosítva');
          this.formModal.hide();
          this.editMode = false;
          this.newPizza = {
            id: 0,
            name: '',
            description: '',
            image: '',
            calory: 0,
            price: 0
          }
          this.getPizzas();
        })
      })
    } else {

      this.api.selectAll('pizzas/name/eq/' + this.newPizza.name).then(res => {
        if (res.data.length != 0) {
          this.message.show('danger', 'Hiba', 'Van már ilyen nevű pizza!');
          return;
        }

        this.api.insert('pizzas', this.newPizza).then(_res => {
          this.message.show('success', 'Ok', 'A pizza hozzáadva');
          this.formModal.hide();
          this.newPizza = {
            id: 0,
            name: '',
            description: '',
            image: '',
            calory: 0,
            price: 0
          }
          this.getPizzas();
        })
      })
    }
  }

  confirmDelete(id: number) {
    this.newPizza.id = id;
    this.confirmModal.show();
  }

  delete(id: number) {

    let pizza = this.pizzas.find(item => item.id == id);
    if (pizza && pizza?.image != '') {
      this.api.deleteImage(pizza.image!);
    }

    this.api.delete('pizzas', id).then(res => {
      this.message.show('success', 'Ok', 'A pizza törölve!');
      this.confirmModal.hide();
      this.getPizzas();
      this.newPizza = {
        id: 0,
        name: '',
        description: '',
        image: '',
        calory: 0,
        price: 0
      }
    })
  }

  deleteImage(id: number, filename: string) {
    this.api.deleteImage(filename).then(res => {
      if (res.status == 200) {
        this.newPizza.image = '',
        this.api.update('pizzas', id, this.newPizza).then(res => {
          this.message.show('success', 'Ok', 'Kép törölve')
        })
      }
    })
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  openLightbox(image: string) {
    this.lightboxImage = 'http://localhost:3000/uploads/'+image;
    this.lightboxVisible = true;
  }
}
