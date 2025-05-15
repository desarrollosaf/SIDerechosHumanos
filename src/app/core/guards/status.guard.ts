import { CanActivateFn } from '@angular/router';

export const statusGuard: CanActivateFn = (route, state) => {
  return true;
};
