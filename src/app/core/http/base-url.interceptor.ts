import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('http')) return next(req);
  return next(req.clone({ url: `${environment.artWork}${req.url}` }));
};
