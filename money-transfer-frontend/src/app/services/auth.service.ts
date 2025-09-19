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
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { User } from '../models/User';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

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
      .get<User>('/api/users/me', { withCredentials: true })
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  logout(): Observable<any> {
    return this.http
      .post('/api/auth/logout', {}, { withCredentials: true })
      .pipe(tap(() => this.currentUserSubject.next(null)));
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value != null;
  }
}
