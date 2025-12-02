import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(
    private auth: AuthService,
    private api: ApiService
  ) { }

  refreshCartCount() {
    const uid = this.auth.loggedUser()[0].id;

    if (!uid) {
      this.clearCartCount();
      return;
    }

    this.api.selectOne('cartcounts/userId/eq', uid).then(res => {
      const total = res.data[0].cartCount;
      this.cartCountSubject.next(total);
    });
  }

  clearCartCount() {
    this.cartCountSubject.next(0);
  }
}
