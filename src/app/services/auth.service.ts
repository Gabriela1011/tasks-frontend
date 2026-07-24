import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginCredentialsDTO, RegisterUserDTO} from '../model/user.model';
import LocalStorageUtils from '../utils/localStorageUtils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(authPayload: LoginCredentialsDTO) {
    return this.http.post<string>('http://localhost:8080/auth/login', authPayload,
      {
        responseType: 'text' as 'json'
      });
  }

  register(registerPayload: RegisterUserDTO) {
    return this.http.post<string>('http://localhost:8080/auth/register', registerPayload,
      {
        responseType: 'text' as 'json'
      });
  }

  logout() {
    LocalStorageUtils.deleteItem(LocalStorageUtils.tokenKey);
  }
}
