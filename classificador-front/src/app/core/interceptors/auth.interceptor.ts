import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

const MUTATION_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const csrfToken = authService.getCsrfToken();
  const requiresCsrf = MUTATION_METHODS.includes(request.method.toUpperCase());
  const headers = requiresCsrf && csrfToken ? request.headers.set('x-csrf-token', csrfToken) : request.headers;

  return next(
    request.clone({
      headers,
      withCredentials: true
    })
  ).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        authService.logout(false);
      }

      return throwError(() => error);
    })
  );
};
