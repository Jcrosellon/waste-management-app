import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expirado o no válido
        authService.logout();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Sin permisos
        console.error('Acceso denegado');
      } else if (error.status === 0) {
        // Error de conexión
        console.error('Error de conexión con el servidor');
      }

      return throwError(() => error);
    })
  );
};
