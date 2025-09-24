import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'map',
    loadComponent: () => import('./app').then(m => m.AppComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/map',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/map'
  }
];
