import { Component, effect, inject, OnInit } from '@angular/core';
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
  
  <button (click)="logout()" class="btn btn-outline-danger btn-sm" title="Cerrar sesión">
    <i class="bi bi-box-arrow-right"></i> Cerrar sesión
  </button>
</nav>
 <main class="container mt-4">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    nav { background: #333; color: white; padding: 1rem; }
    nav a { color: white; margin-right: 1rem; text-decoration: none; }
    nav a.active { font-weight: bold; }
    main { padding: 1rem; }
  `]
})
export class MainLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  ngOnInit() {
    if (!this.authService?.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService?.clearToken();
    this.router?.navigate(['/login']);
    window.location.reload(); //parch solution
  }

}
