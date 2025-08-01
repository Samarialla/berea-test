import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <nav class="d-flex justify-content-between align-items-center p-3 border-bottom">
  <a routerLink="/home" routerLinkActive="active" class="navbar-brand">Prueba técnica</a> 
  <button (click)="logout()" class="btn btn-outline-info btn-sm" title="Cerrar sesión">
    <i style="font-size: 12px;" class="material-icons me-2">logout</i>Cerrar sesión
  </button>
</nav>
 <main class="">
     <router-outlet></router-outlet>
  </main>
  `,
  styles: [`
    nav { background: #333; color: white; padding: 1rem; }
    nav a { color: white; margin-right: 1rem; text-decoration: none; }
    nav a.active { font-weight: bold; }
    main { padding: 1rem; background: #dee2e7ff; min-height: 100vh; box-sizing: border-box; }
  `]
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);



  logout() {
    this.authService?.clearToken();
    this.router?.navigate(['/login'], { replaceUrl: true });
  }

}
