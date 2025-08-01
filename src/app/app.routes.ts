import { Routes } from '@angular/router';
import { LoginPage } from './auth/login.page';
import { MainLayoutComponent } from './pages/shared/main-layout';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
      },
      {
        path: 'products/:id',
        loadComponent: () => import('./pages/detail-product/detail-product').then(m => m.DetailProduct),
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

