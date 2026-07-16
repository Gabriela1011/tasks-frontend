import { inject, Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoggedInGuardService {
  private readonly router: Router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(localStorage.getItem('user') != null){
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
  
}
