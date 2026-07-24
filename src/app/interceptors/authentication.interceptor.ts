import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import LocalStorageUtils from '../utils/localStorageUtils';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('login') || req.url.includes('register')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  const token = LocalStorageUtils.getItem(LocalStorageUtils.tokenKey);

  const processedRequest = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(processedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}
