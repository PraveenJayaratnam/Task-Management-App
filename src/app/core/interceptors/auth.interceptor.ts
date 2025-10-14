import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const user = localStorage.getItem('user');

  if (user) {
    const cloned = req.clone({
      setHeaders: { 'X-User': user },
    });
    return next(cloned);
  }
  return next(req);
};
