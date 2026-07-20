import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserSummaryDTO } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getUserSummaries() {
    return this.http.get<UserSummaryDTO[]>('http://localhost:8080/users/summary');
  }
}
