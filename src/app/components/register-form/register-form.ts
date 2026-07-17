import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string | null>(null);

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    username: ['', [Validators.required, Validators.maxLength(500)]],
    birthDate: ['', Validators.required]
  });

  onSubmit(): void {
    this.errorMessage.set(null);

    if(this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const registerData = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);

        localStorage.setItem('loggedUser', JSON.stringify(response));

        this.router.navigate(['/myTasks']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        const backendErrorMessage = err.error?.message || err.error || 'An error occurred during registration. Try again later.';
        this.errorMessage.set(backendErrorMessage);
      }
    });
  }
}
