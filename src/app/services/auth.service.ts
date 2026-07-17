import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginCredentialsDTO, RegisterUserDTO, UserDetailsDTO } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(authPayload: LoginCredentialsDTO) {
    return this.http.post<UserDetailsDTO>('http://localhost:8080/auth/login', authPayload);
  }

  register(registerPayload: RegisterUserDTO) {
    return this.http.post<UserDetailsDTO>('http://localhost:8080/users', registerPayload);
  }
}
