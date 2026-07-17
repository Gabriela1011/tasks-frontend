import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthToggle } from '../components/auth-toggle/auth-toggle';
import { RegisterForm } from '../components/register-form/register-form';
import { LoginForm } from '../components/login-form/login-form';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, AuthToggle, RegisterForm, LoginForm],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  isLoginMode = signal<boolean>(true);
}

