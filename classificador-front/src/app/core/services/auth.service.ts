import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

const CSRF_TOKEN_KEY = 'sentinel_csrf_token';
const AUTH_STATUS_KEY = 'sentinel_auth_status';
const USER_KEY = 'sentinel_user';

interface ApiResponse<T> {
  data: T;
}

interface LoginResponse {
  message: string;
}

interface CsrfResponse {
  token: string;
}

interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(this.loadStoredUser());

  readonly currentUser$ = this.currentUserSubject.asObservable();

  login(payload: LoginPayload): Observable<AuthUser> {
    return this.ensureCsrfToken().pipe(
      switchMap(() => this.http.post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/login`, payload)),
      map(() => this.createSessionUser(payload.email)),
      tap((user) => {
        this.persistSession(user);
      })
    );
  }

  register(payload: RegisterPayload): Observable<AuthUser> {
    const createUserPayload = {
      ...payload,
      role: 'OPERATOR',
      is_active: true
    };

    return this.ensureCsrfToken().pipe(
      switchMap(() => this.http.post<ApiResponse<BackendUser>>(`${environment.apiUrl}/users`, createUserPayload)),
      switchMap(() => this.login({ email: payload.email, password: payload.password }))
    );
  }

  logout(remote = true): void {
    const clearLocalSession = () => {
      localStorage.removeItem(AUTH_STATUS_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(CSRF_TOKEN_KEY);
      this.currentUserSubject.next(null);
      void this.router.navigate(['/login']);
    };

    if (!remote) {
      clearLocalSession();
      return;
    }

    this.ensureCsrfToken()
      .pipe(switchMap(() => this.http.post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/logout`, {})))
      .subscribe({
        next: clearLocalSession,
        error: clearLocalSession
      });
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(AUTH_STATUS_KEY) === 'authenticated';
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(CSRF_TOKEN_KEY);
  }

  getCsrfToken(): string | null {
    return localStorage.getItem(CSRF_TOKEN_KEY);
  }

  ensureCsrfToken(): Observable<string> {
    const cachedToken = this.getCsrfToken();

    if (cachedToken) {
      return of(cachedToken);
    }

    return this.http.get<ApiResponse<CsrfResponse>>(`${environment.apiUrl}/csrf-token`).pipe(
      map((response) => response.data.token),
      tap((token) => {
        localStorage.setItem(CSRF_TOKEN_KEY, token);
      })
    );
  }

  private persistSession(user: AuthUser): void {
    localStorage.setItem(AUTH_STATUS_KEY, 'authenticated');
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadStoredUser(): AuthUser | null {
    const user = localStorage.getItem(USER_KEY);

    if (!user || !this.isAuthenticated()) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }

  private createSessionUser(email: string): AuthUser {
    const name = email.split('@')[0] || 'Operator';

    return {
      id: 'cookie-session',
      name,
      email,
      role: 'OPERATOR',
      token: 'http-only-cookie-session'
    };
  }
}
