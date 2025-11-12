import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../interfaces/user';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  constructor(private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  myProfile: User = {
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: ''
  }



  getProfile() {
    this.myProfile = this.auth.loggedUser()[0];
  }

  update() {

  }
}
