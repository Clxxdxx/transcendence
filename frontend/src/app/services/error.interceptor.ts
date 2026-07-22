import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 || (err.status === 404 && req.url.includes('/users'))) {
        console.warn('⚠️ Ghost session detected! Clearing data...');
        localStorage.clear();
        window.location.reload();
      }
      return throwError(() => err);
    })
  );
};