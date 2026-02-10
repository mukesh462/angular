import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './menu/menu';
import { Main } from './main/main';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Main, Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('reporting-dashboard');
  user = {
    name: 'Anto',
  };
  onChange(e: string) {
    this.user.name = e;
  }
  route: Array<{ name: string; url: string }> = [
    {
      name: 'Home',
      url: '/',
    },
    {
      name: 'Movies',
      url: '/movies',
    },
    {
      name: 'Songs',
      url: '/songs',
    },
    {
      name: 'Form Page',
      url: '/form-page',
    },
    {
      name: 'Store',
      url: '/store',
    },
    {
      name: 'Todo',
      url: '/todo',
    },
  ];
}
