import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserDetailsDTO } from '../model/user-details-dto.model';
import { LoginCredentialsDTO } from '../model/login-credentials.model';
import { RegisterUserDTO } from '../model/register-user-dto.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);

  login(authPayload: LoginCredentialsDTO) {
    return this.http.post<UserDetailsDTO>('http://localhost:8080/auth/login', authPayload);
  }

  register(registerPayload: RegisterUserDTO) {
    return this.http.post<UserDetailsDTO>('http://localhost:8080/users', registerPayload);
  }
}
