import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class TransferService {
  constructor(private api: ApiService, private http: HttpClient) {}

  createTransfer(fromUserId: number | null, toUserId: number, amount: number) {
    return this.api.post('/transfers', { fromUserId, toUserId, amount });
  }

  getTransfers(userId: number | null): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:8080/api/transfers/user/${userId}`,
      { withCredentials: true }
    );
  }

  getEntry(entryId: number) {
    return this.api.get(`/entries/${entryId}`);
  }

  getUserHead(userId: number) {
    return this.api.get(`/entries/user/${userId}/head`);
  }

  getUserTail(userId: number) {
    return this.api.get(`/entries/user/${userId}/tail`);
  }

  getUser(userId: number) {
    return this.api.get(`/users/${userId}`);
  }
}
