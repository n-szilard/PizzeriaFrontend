import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../interfaces/user';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Order } from '../../../interfaces/order';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  // lapozo valtozok
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedUsers: User[] = [];
  startIndex = 1;
  endIndex = 1;

  users: User[] = [];

  loggedUser: User = {
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: ''
  };

  orders: Order[] = [];

  selectedUser: User = {
    id: 0,
    name: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    address: '',
    role: '',
    reg: '',
    last: '',
    status: false
  }
  
  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {}
  
  ngOnInit(): void {
    this.getUsers();
    this.getLoggedUser();
  }

  getLoggedUser() {
    this.loggedUser = this.auth.loggedUser()[0];
  }

  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }

  getUserInfo(userId?: number) {
    if (userId) {
      this.api.selectOne('users', userId).then( res => {
        this.selectedUser = res.data[0];
      })

      this.api.selectOne('ordersall', userId).then(res => {
        this.orders = res.data;
      })
    }
  }

  statusChange(id?: number) {
    if (id) {
      let idx = this.users.findIndex(user => user.id == id);
      this.users[idx].status = !this.users[idx].status;
  
      this.api.update('users', id, { status: this.users[idx].status ? 1 : 0}).then( res => {
        console.log(res);
      })
    }
  }

  clearSelectedUser() {
    this.selectedUser = {
      id: 0,
      name: '',
      email: '',
      password: '',
      confirm: '',
      phone: '',
      address: '',
      role: '',
      reg: '',
      last: '',
      status: false
    }

    this.orders = [];
  }

  getUsers() {
    this.api.selectAll('users').then(res => {
      this.users = res.data;
      this.totalPages = Math.ceil(this.users.length / this.pageSize)
      this.setPage(1);
    })
  }

}
