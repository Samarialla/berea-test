import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { ILoginCredentials } from '../interface/ILoginCredentials';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  private fb = inject(FormBuilder);

  loading = signal(false);
  error = signal('');
  success = signal(false);
  form = this.fb.group({
    email: ['john@mail.com', [Validators.required, Validators.email]],
    password: ['changeme', Validators.required], // pass 'changeme' for testing
  });
  disabled = computed(() => this.form?.invalid || this.loading());

  //private auth = inject(AuthService);
  //private router = inject(Router);

constructor(
  //private fb: FormBuilder,
  private auth: AuthService,
  private router: Router
) {
  effect(() => {
    if (this.auth?.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  });
}

    onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set('');

    this.auth
      .login(this.form.value as ILoginCredentials)
      .pipe(
        catchError(() => {
          this.error.set('Credenciales incorrectas');
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((res) => {
        if (res) {
          this.auth.setToken(res.access_token);
          this.success.set(true);
          setTimeout(() => this.router.navigate(['/home']), 300);
        }
      });
  }
}
