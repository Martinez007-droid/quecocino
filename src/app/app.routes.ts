import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'detalle/:id',
    loadComponent: () => import('./detalle/detalle.page').then(m => m.DetallePage),
    canActivate: [authGuard]
  },
  {
    path: 'favoritas',
    loadComponent: () => import('./favoritas/favoritas.page').then(m => m.FavoritasPage),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];