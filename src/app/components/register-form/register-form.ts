import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FieldError } from '../field-error/field-error';
import { InvalidControl } from '../../directives/invalid-control';
import LocalStorageUtils from '../../utils/localStorageUtils';
import { RegisterUserDTO } from '../../model/user.model';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, FieldError, InvalidControl],
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

    const encodedRegisterData: RegisterUserDTO = {
      email: btoa(this.registerForm.value.email),
      password: btoa(this.registerForm.value.password),
      username: this.registerForm.value.username,
      birthDate: this.registerForm.value.birthDate
    };

    this.authService.register(encodedRegisterData).subscribe({
      next: (response) => {
        console.log('Registration successful!');

        LocalStorageUtils.setItem(LocalStorageUtils.tokenKey, response);

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
