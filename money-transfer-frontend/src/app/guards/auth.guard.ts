// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { Observable, map, catchError, of } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//   constructor(private http: HttpClient, private router: Router) {}

//   canActivate(): Observable<boolean> {
//     // Call backend to check if JWT cookie is valid
//     return this.http
//       .get('http://localhost:8080/api/users/me', { withCredentials: true })
//       .pipe(
//         map(() => true),
//         catchError(() => {
//           this.router.navigate(['/login']);
//           return of(false);
//         })
//       );
//   }
// }

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//   constructor(private http: HttpClient, private router: Router) {}

//   canActivate(): Observable<boolean> {
//     return this.http
//       .get('http://localhost:8080/api/users/me', { withCredentials: true })
//       .pipe(
//         map(() => true),
//         catchError(() => {
//           this.router.navigate(['/login']);
//           return of(false);
//         })
//       );
//   }
// }

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      map((user) => {
        if (user) return true; // ✅ user exists → allow access
        this.router.navigate(['/login']); // ❌ no user → redirect
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/login']); // ❌ error (e.g., 401) → redirect
        return of(false);
      })
    );
  }
}
