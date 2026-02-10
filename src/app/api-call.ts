import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Item } from './store/store';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiCall {
  private products$?: Observable<Item[]>;

  constructor(private http: HttpClient) {}

  getAllData(): Observable<Item[]> {
    if (!this.products$) {
      this.products$ = this.http
        .get<Item[]>('https://fakestoreapi.com/products')
       ;
    }
    return this.products$;
  }
}
