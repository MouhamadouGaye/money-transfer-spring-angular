// // src/app/services/auth.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private currentUserSubject = new BehaviorSubject<User | null>(null);
//   currentUser$ = this.currentUserSubject.asObservable();

//   private apiUrl = 'http://localhost:8080/api/auth';

//   constructor(private http: HttpClient) {}

//   register(username: string, email: string, password: string): Observable<any> {
//     return this.http.post(
//       'http://localhost:8080/api/users/register',
//       { username, email, password },
//       { withCredentials: true }
//     );
//   }

//   login(email: string, password: string): Observable<any> {
//     return this.http.post(
//       `${this.apiUrl}/login`,
//       { email, password },
//       { withCredentials: true }
//     );
//   }

//   getCurrentUser(): Observable<any> {
//     return this.http.get('http://localhost:8080/api/users/me', {
//       withCredentials: true,
//     });
//   }

//   logout(): Observable<any> {
//     return this.http.post(
//       `${this.apiUrl}/logout`,
//       {},
//       { withCredentials: true }
//     );
//   }

// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { User } from '../models/User';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  apiUrl = 'http://localhost:8080/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  // currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadCurrentUser();
  }
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/users/register`,
      { username, email, password },
      { withCredentials: true }
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        switchMap(() => this.getCurrentUser()) // <-- fetch user right after login
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/users/me`, { withCredentials: true })
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  private loadCurrentUser() {
    this.http
      .get<User>(`${this.apiUrl}/users/me`, { withCredentials: true })
      .subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.currentUserSubject.next(null),
      });
  }
  // auth.service.ts - UPDATE
  getCurrentUser2(): Observable<User | null> {
    return this.http
      .get<User>(`${this.apiUrl}/auth/me`, {
        withCredentials: true,
        observe: 'response', // Get full response including status
      })
      .pipe(
        map((response) => {
          if (response.status === 200 && response.body) {
            return response.body; // Return user data
          }
          return null; // Return null for non-200 responses
        }),
        catchError((error) => {
          console.log('getCurrentUser error status:', error.status);
          return of(null); // Return null instead of throwing error
        })
      );
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
        })
      );
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value != null;
  }
}
