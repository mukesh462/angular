import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiCall } from '../api-call';
import { single } from 'rxjs';

export interface Item {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  quantity?: number;
}

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store.html',
  styleUrls: ['./store.css'],
})
export class Store {
  // Signal for items (list of products)
  items = signal<Item[]>([]);

  // Signal for cart (array of items)
  cart = signal<Item[]>([]);
  constructor(private api: ApiCall) {
    // Load items from API directly in constructor or ngOnInit
    this.api.getAllData().subscribe((data) => {
      this.items.set(data); // update signal
    });
  }
  price = computed(()=> this.cart().reduce((a,b)=> (Math.round(b.price) * (b.quantity ?? 0))   + a,0))

  // Add item to cart
  addToCart(item: Item) {
    const end = this.cart().find((cartItem) => cartItem.id === item.id);
    if (end) {
      const ff = this.cart()
        .filter((cartItem) => cartItem.id !== item.id)
        .concat({ ...end,quantity: (end.quantity ?? 0) + 1 });
      console.log(ff, 'sdwd');
      this.cart.set(ff);
    } else {
      this.cart.update((current) => [...current, { ...item, quantity: 1 }]); // immutable update
    }
  }
}
