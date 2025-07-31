import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ILoginCredentials } from '../interface/ILoginCredentials';
import { ILoginResponse } from '../interface/ILoginResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private api = 'https://api.escuelajs.co/api/v1/auth';
  private isBrowser = isPlatformBrowser(this.platformId);

  private _token = signal<string | null>(null);
  readonly token = computed(() => this._token());

  constructor() {
    if (this.isBrowser) {
      const storedToken = localStorage?.getItem('token');
       this._token.set(storedToken ?? '');
    }
  }

  login(credentials: ILoginCredentials): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.api}/login`, credentials).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  setToken(token: string) {
    this._token.set(token);
    if (this.isBrowser) {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this._token?.set('');
    if (this.isBrowser) {
      localStorage?.removeItem('token');
    }
  }

  isAuthenticated = computed(() => !!this._token());
}
