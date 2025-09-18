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

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.http
      .get('http://localhost:8080/api/users/me', { withCredentials: true })
      .pipe(
        map(() => true),
        catchError(() => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
  }
}
