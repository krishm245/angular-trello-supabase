import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser.pipe(
      filter((val) => val !== null),
      take(1),
      map((isAuthenticated) => {
        console.log('Is authenticated', isAuthenticated);
        if (isAuthenticated.aud == 'authenticated') {
          this.router.navigate(['/workspace']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
