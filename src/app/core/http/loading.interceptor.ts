import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { loadingCount } from '../loading.signal';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  loadingCount.update((n) => n + 1);
  return next(req).pipe(finalize(() => loadingCount.update((n) => n - 1)));
};
