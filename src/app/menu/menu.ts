import { JsonPipe } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { single } from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [RouterLink,JsonPipe],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  @Input() route!: {
    name: string;
    url: string;
  };
  deepa = signal(0);


  @Input() class: string = '';
  test={
    name:"anto"

  }
  increase(){
    this.deepa.update((c)=> c+1)
  }
}
