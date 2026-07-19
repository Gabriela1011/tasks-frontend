import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FieldError } from '../field-error/field-error';
import { InvalidControl } from '../../directives/invalid-control';

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

    const loginData = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);

        localStorage.setItem('loggedUser', JSON.stringify(response));

        this.router.navigate(['/myTasks']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        const backendErrorMessage = err.error?.message || err.error || 'An error occurred during login.';
        this.errorMessage.set(backendErrorMessage);
      }
    });
  }
}
