import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);

  const token = localStorage.getItem('myToken');

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp > now) {
        // Token válido y no expirado
        return true;
      } else {
        // Token expirado
        localStorage.removeItem('myToken');
      }
    } catch (error) {
      // Token inválido (formato incorrecto o manipulado)
      localStorage.removeItem('myToken');
    }
  }

  // If the user is not logged in, redirect to the login page with the return URL
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url.split('?')[0] } });
  return false;
  
};
