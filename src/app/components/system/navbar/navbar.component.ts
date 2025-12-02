import { Component, Input, OnInit } from '@angular/core';
import { NavItem } from '../../../interfaces/navitem';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Input() title = '';

  isLoggedIn = false;
  loggedUserName = '';
  isAdmin = false;
  cartCount = 0;

  constructor(
    private auth: AuthService,
    private cart: CartService
  ) { }

  navItems: NavItem[] = [];

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(res => {
      this.isLoggedIn = res;
      if (this.isLoggedIn) {
        this.loggedUserName = this.auth.loggedUser()[0].name;
        this.isAdmin = this.auth.isAdmin();
        this.cart.refreshCartCount();
        
        this.cart.cartCount$.subscribe(count => {
          this.cartCount = count;
          this.setupMenu(res);
        })
      } else {
        this.loggedUserName = '';
        this.cartCount = 0;
        this.setupMenu(false);
      }
    });
  }

  setupMenu(isLoggedIn: boolean) {
    this.navItems = [
      {
        name: 'Pizzalista',
        url: 'pizzalist',
        icon: 'bi-card-list'
      },

      ...(isLoggedIn) ? [
        {
          name: 'Kosár',
          url: 'cart',
          icon: 'bi-cart',
          badge: this.cartCount
        },
        ...(this.isAdmin) ? [
          {
            name: 'Pizzák kezelése',
            url: 'pizzas',
            icon: 'bi-database'
          },
          {
            name: 'Felhasználók kezelése',
            url: 'users',
            icon: 'bi-people'
          },
          {
            name: 'Rendelések kezelése',
            url: 'orders',
            icon: 'bi-receipt'
          },
          {
            name: 'Statisztika',
            url: 'stats',
            icon: 'bi-graph-up-arrow'
          }
        ] : [
          {
            name: 'Rendeléseim',
            url: 'myorders',
            icon: 'bi-clock-history'
          }
        ],
        {
          name: 'Profilom',
          url: 'profile',
          icon: 'bi-person'
        },
        {
          name: 'Kilépés',
          url: 'logout',
          icon: 'bi-box-arrow-left'
        },
      ] : [
        {
          name: 'Regisztráció',
          url: 'registration',
          icon: 'bi-person-add'
        },
        {
          name: 'Belépés',
          url: 'login',
          icon: 'bi-box-arrow-right'
        },
      ]

    ]
  }

}