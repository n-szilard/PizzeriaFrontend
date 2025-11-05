import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../../interfaces/user';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private api: ApiService,
    private message: MessageService,
    private auth: AuthService,
    private router: Router
  ){}

  user: User = {
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: ''
  }

  rememberMe: boolean = false;

  login() {
    this.api.login('users', this.user).then(res => {
      if (res.status == 500) {
        this.message.show('danger', 'Hiba', res.message);
        return;
      }

      if (this.rememberMe) {
        this.auth.storeUser(JSON.stringify(res.data))
      }

      this.auth.login(JSON.stringify(res.data));
      this.router.navigate(['/pizzalist']);
    });
  }
}
