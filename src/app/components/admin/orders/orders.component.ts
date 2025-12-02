import { Component, OnInit } from '@angular/core';
import { Order } from '../../../interfaces/order';
import { ApiService } from '../../../services/api.service';
import { NgForOf, NgIf } from "@angular/common";
import { MessageService } from '../../../services/message.service';
import { NumberFormatPipe } from '../../../pipes/number-format.pipe';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgForOf, NgIf, NumberFormatPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{

  orders: Order[] = [];
  displayedOrders: Order[] = [];

  constructor(
    private api: ApiService,
    private message: MessageService
  ) {}


  ngOnInit(): void {
    this.getAllOrders(true);
  }


  async getAllOrders(filter: boolean) {
    await this.api.selectAll('ordersall').then(res => {
      this.orders = res.data;
    })

    if (filter) {
      this.filterDisplayedOrders('pending');
    }
  }

  async modifyStatus(id: number) {
    let idx = this.orders.findIndex(x => x.id == id);

    let oldStatus = this.orders[idx].status;
    let newStatus = '';

    switch (oldStatus) {
      case 'pending':
        newStatus = 'preparing'
        break;
      case 'preparing':
        newStatus = 'delivering'
        break;
      case 'delivering':
        newStatus = 'completed'
        break;
    }

    const timeStamp = this.getMySQLDateTime();

    await this.api.update('orders', id, {status: newStatus, updatedAt: timeStamp});

    await this.getAllOrders(false);
    this.filterDisplayedOrders(oldStatus);

    this.message.show('success', 'OK', `Rendelés áthelyezve a ${newStatus}-hez`)
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


  filterDisplayedOrders(filter: string) {
    switch (filter) {
      case 'pending':
        this.displayedOrders = this.orders.filter(x => x.status == 'pending');
        break;
      case 'preparing':
        this.displayedOrders = this.orders.filter(x => x.status == 'preparing');
        break;
      case 'delivering':
        this.displayedOrders = this.orders.filter(x => x.status == 'delivering');
        break;
      case 'completed':
        this.displayedOrders = this.orders.filter(x => x.status == 'completed');
        break;
    }
  }
}

