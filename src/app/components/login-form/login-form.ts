import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FieldError } from '../field-error/field-error';
import { InvalidControl } from '../../directives/invalid-control';
import LocalStorageUtils from '../../utils/localStorageUtils';
import { AuthResponseDTO, LoginCredentialsDTO } from '../../model/user.model';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, FieldError, InvalidControl],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    this.errorMessage.set(null);

    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const encodedLoginData: LoginCredentialsDTO = {
      email: btoa(this.loginForm.value.email),
      password: btoa(this.loginForm.value.password)
    };

    this.authService.login(encodedLoginData).subscribe({
      next: (response: AuthResponseDTO) => {
        LocalStorageUtils.setItem(LocalStorageUtils.tokenKey, response.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        const backendErrorMessage = err.error?.message || 'An error occurred during login.';
        this.errorMessage.set(backendErrorMessage);
      }
    });
  }

}
