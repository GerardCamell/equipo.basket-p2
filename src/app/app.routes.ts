import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { JugadoresComponent } from './components/jugadores/jugadores';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'jugadores', component: JugadoresComponent }
];
