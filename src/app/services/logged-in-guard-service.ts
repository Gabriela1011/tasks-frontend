import { inject, Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import LocalStorageUtils from '../utils/localStorageUtils';

@Injectable({
  providedIn: 'root',
})
export class LoggedInGuardService {
  private readonly router: Router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(LocalStorageUtils.getItem(LocalStorageUtils.tokenKey)){
      return true;
    }

    this.router.navigate(['/login']).then();
    return false;
  }

}
