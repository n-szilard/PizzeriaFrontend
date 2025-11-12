import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../interfaces/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: User[] = [];

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
  }
  
  constructor(
    private api: ApiService
  ) {}
  
  ngOnInit(): void {
    this.getUsers();
  }

  getUserInfo(userId?: number) {
    if (userId) {
      this.api.selectOne('users', userId).then( res => {
        this.selectedUser = res.data[0];
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
    }
  }

  getUsers() {
    this.api.selectAll('users').then(res => {
      this.users = res.data;
    })
  }

}
