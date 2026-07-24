import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthResponseDTO, LoginCredentialsDTO, RegisterUserDTO} from '../model/user.model';
import LocalStorageUtils from '../utils/localStorageUtils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(authPayload: LoginCredentialsDTO) {
    return this.http.post<AuthResponseDTO>('http://localhost:8080/auth/login', authPayload);
  }

  register(registerPayload: RegisterUserDTO) {
    return this.http.post<AuthResponseDTO>('http://localhost:8080/auth/register', registerPayload);
  }

  logout() {
    LocalStorageUtils.deleteItem(LocalStorageUtils.tokenKey);
  }
}
