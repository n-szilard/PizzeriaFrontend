import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { CartItem } from '../../../interfaces/cartItem';
import { CommonModule, NgForOf } from "@angular/common";
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';
import { FormsModule } from "@angular/forms";
import { MessageService } from '../../../services/message.service';
import { CartService } from '../../../services/cart.service';
import { Order } from '../../../interfaces/order';
import { OrderItem } from '../../../interfaces/orderItem';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, NumberFormatPipe, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private message: MessageService,
    private cart: CartService
  ) { }

  items: CartItem[] = [];
  allTotal = 0;
  newOrder: Order = {
    userId: 0,
    total: 0,
    status: '',
    createdAt: '',
    updatedAt: ''
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.api.selectAll('carts_vt/userId/eq/' + this.auth.loggedUser()[0].id).then(res => {
      this.items = res.data as CartItem[];
      this.allTotal = 0;
      this.items.forEach(item => this.allTotal += item.total)
    });
  }

  update(item: CartItem) {
    let data = {
      amount: item.amount
    }
    this.api.update('carts', item.id, data).then(res => {
      if (res.status == 500) {
        this.message.show('danger', 'Hiba', res.message!)
        return;
      }
      this.message.show('success', 'Ok', 'A tétel módosítva');
      this.getData();
    })
  }

  remove(id: number) {
    if (confirm('Biztosan ki szeretnéd törölni a kosárból?')) {
      this.api.delete('carts', id).then(res => {
        if (res.status == 500) {
          this.message.show('danger', 'Hiba', res.message!)
          return;
        }
        this.getData();
        this.cart.refreshCartCount();
      })
    }
  }

  removeAll() {
    if (confirm('Biztosan üríted a teljes kosarat?')) {
      this.api.delete('carts/userId/eq', this.auth.loggedUser()[0].id).then(res => {
        if (res.status == 500) {
          this.message.show('danger', 'Hiba', res.message!)
          return;
        }
        this.message.show('success', 'Ok', 'A kosár ürítve!');
        this.cart.clearCartCount();
        this.getData();
      });
    }
  }

  sendOrder() {
    this.newOrder.userId = this.auth.loggedUser()[0].id;
    this.newOrder.status = 'pending';
    this.newOrder.total = this.allTotal;

    let currentTime: string = this.getMySQLDateTime();
    this.newOrder.updatedAt = currentTime;

    this.api.insert('orders', this.newOrder).then(res => {

      const orderId = res.data.insertId;
      let promises: Promise<any>[] = [];

      this.items.forEach(item => {
        let orderItem: OrderItem = {
          orderId: res.data.insertId,
          pizzaId: item.pizzaId,
          quantity: item.amount,
          price: item.price,
        }


        let p = this.api.insert('order_items', orderItem).then(res => {
          return this.api.delete('carts', item.id);
        })

        promises.push(p)
      });

      Promise.all(promises).then(() => {
        this.message.show('success', 'Siker', 'A rendelés leadva');
        this.getData();
        this.cart.clearCartCount();
        this.newOrder = {
          userId: 0,
          total: 0,
          status: '',
          createdAt: '',
          updatedAt: ''
        }
      });
    })
  }

  getMySQLDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
