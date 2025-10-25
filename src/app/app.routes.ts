import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { PlayersComponent } from './players-component/players-component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'players', component: PlayersComponent }
];
