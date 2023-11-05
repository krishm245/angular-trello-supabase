import { CanActivate, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.currentUser.pipe(
      filter((val) => val !== null),
      take(1),
      map((isAuthenticated) => {
        console.log('Is authenticated', isAuthenticated);
        if (isAuthenticated?.aud == 'authenticated') {
          return true;
        } else {
          return this.router.createUrlTree(['/']);
        }
      })
    );
  }
}
