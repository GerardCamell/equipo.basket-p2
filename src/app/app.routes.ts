import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'players',
    loadComponent: () =>
      import('./players-component/players-component').then(m => m.PlayersComponent)
  },
  {
    path: 'create-player',
    loadComponent: () =>
      import('./form-player/form-player').then(m => m.FormPlayer)
  }
];