import { Routes } from '@angular/router';
import { App } from './app';
import { Movies } from './movies/movies';
import { Songs } from './songs/songs';
import { Main } from './main/main';
import { Movie } from './movie/movie';
import { FormPage } from './form-page/form-page';
import { Store } from './store/store';


export const routes: Routes = [
  {
    path: '',
    component: Main,
  },
  {
    path: 'movies',
    component: Movies,
    children: [
      {
        path: ':id',
        component: Movie,
      },
    ],
  },
  {
    path: 'songs',
    component: Songs,
  },
  {
    path: 'form-page',
    component: FormPage,
  },
  {
    path: 'store',
    component: Store,
  },

];
