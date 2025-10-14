import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated) {
    return true;
  }

  const returnUrl = state.url;
  router.navigate(['/login'], {
    queryParams: { returnUrl },
    replaceUrl: true,
  });

  return false;
};
