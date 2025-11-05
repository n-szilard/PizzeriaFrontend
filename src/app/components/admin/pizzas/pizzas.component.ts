import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { Pizza } from '../../../interfaces/pizza';

@Component({
  selector: 'app-pizzas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pizzas.component.html',
  styleUrl: './pizzas.component.scss'
})
export class PizzasComponent implements OnInit{
  
  pizzas: Pizza[] = [];

  currency = 'Ft';

  constructor(
    private api: ApiService
  ){}
  
  ngOnInit(): void {
    this.getPizzas();
  }

  getPizzas() {
    this.api.selectAll('pizzas').then(res => {
      this.pizzas = res.data;
    })
  }
}
