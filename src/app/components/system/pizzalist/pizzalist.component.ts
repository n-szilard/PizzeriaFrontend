import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Pizza } from '../../../interfaces/pizza';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
import { MessageService } from '../../../services/message.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-pizzalist',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberFormatPipe],
  templateUrl: './pizzalist.component.html',
  styleUrl: './pizzalist.component.scss'
})
export class PizzalistComponent implements OnInit {

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private message: MessageService,
    private cart: CartService
  ) { }

  pizzas: Pizza[] = [];
  filteredPizzzas: Pizza[] = [];
  currency: string = 'Ft';
  isLoggedIn = false;
  searchTerm = '';

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedUser();
    this.getPizzas();
  }

  getPizzas() {
    this.api.selectAll('pizzas').then(res => {
      this.pizzas = res.data;
      this.pizzas.forEach(pizza => {
        pizza.amount = 0;
      })

      this.filteredPizzzas = this.pizzas;
    })
  }

  addToCart(pizzaId: number) {
    const pizza = this.pizzas.find(pizza => pizza.id == pizzaId);
    const amount = pizza!.amount;

    if (amount == 0) {
      this.message.show('danger', 'Hiba', 'Adj meg egy mennyiséget!');
      return;
    }

    let data = {
      userId: this.auth.loggedUser()[0].id,
      pizzaId: pizzaId,
      amount: amount
    }

    pizza!.amount = 0;

    this.api.selectAll('carts/userId/eq/' + data.userId).then(res => {
      let idx = -1;
      if (res.data.length > 0) {
        idx = res.data.findIndex((item: { pizzaId: number; }) => item.pizzaId == data.pizzaId);
      }

      if (idx > -1) {
        // van mar ilyen a kosarban, updatelni kell
        data.amount = res.data[idx].amount + amount;
        this.api.update('carts', res.data[idx].id, data).then(res => {
          this.message.show('success', 'Ok', 'A tétel darabszáma módosítva');
        })
      } else {
        // nincs meg ilyen a kosarban, be kell rakni
        this.api.insert('carts', data).then(res => {
          this.message.show('success', 'Ok', 'A tétel hozzáadva a kosárba');
          this.cart.refreshCartCount();
        });
      }
    })
  }

  filterPizzas() {
    const term = this.searchTerm.toLocaleLowerCase().trim();
    this.filteredPizzzas = this.pizzas.filter(p => p.name.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term))
  }

}
