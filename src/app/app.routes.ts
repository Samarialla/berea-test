import { Routes } from '@angular/router';
import { LoginPage } from './auth/login.page';
import { MainLayoutComponent } from './pages/shared/main-layout';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
   {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
   },
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
            path: 'home',
            loadComponent: () => import('./pages/home/home').then(m => m.Home),
         }
      ]
   },
   {
      path: '**',
      redirectTo: 'login'
   }
];
