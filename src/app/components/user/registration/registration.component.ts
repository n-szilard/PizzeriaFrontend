import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { ApiService } from '../../../services/api.service';
import { User } from '../../../interfaces/user';
import { FormsModule } from '@angular/forms'
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  constructor(private api: ApiService,
    private message: MessageService,
    private router: Router) { }

  acceptTerms: boolean = false;

  newUser: User = {
    name: '',
    email: '',
    password: '',
    confirm: '',
    role: 'user'
  }

  register() {
    if (!this.acceptTerms || !this.newUser.name || !this.newUser.email || !this.newUser.password || !this.newUser.confirm) {
      this.message.show("danger", "Hiba", "Nem adtál meg minden adatot!")
      return;
    }

    this.api.registration('users', this.newUser).then(res => {
      if (res.status == 500) {
        this.message.show('danger', 'Hiba', res.message);
        return;
      }

      let data = {
        "template": "registration",
        "to": this.newUser.email,
        "subject": "Regisztráció",
        "data": {
          "name": this.newUser.name,
          "url": "localhost",
          "email": this.newUser.email,
          "company": "Oláh család pizzéria",
          "password": this.newUser.password
        }
      }

      this.api.sendMail(data);

      this.message.show('success', 'Ok', res.message);
      this.newUser = {
        id: 0,
        name: '',
        email: '',
        password: '',
        confirm: '',
        role: 'user'
      }
      this.router.navigate(['/login']);
    })
  }
}
