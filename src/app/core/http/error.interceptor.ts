import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export interface HttpError {
  status: number;
  message: string;
  cause: unknown;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const httpError: HttpError = {
          status: err.status,
          message: err.message,
          cause: err,
        };
        return throwError(() => httpError);
      }
      return throwError(() => err);
    }),
  );
