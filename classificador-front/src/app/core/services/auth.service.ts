import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth_token';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(credentials: LoginCredentials): void {
    localStorage.setItem(TOKEN_KEY, btoa(`${credentials.email}:${Date.now()}`));
  }

  register(credentials: RegisterCredentials): void {
    localStorage.setItem(TOKEN_KEY, btoa(`${credentials.email}:${credentials.name}:${Date.now()}`));
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }
}
