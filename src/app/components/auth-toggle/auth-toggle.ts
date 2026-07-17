import { Component, model } from '@angular/core';

@Component({
  selector: 'app-auth-toggle',
  imports: [],
  templateUrl: './auth-toggle.html',
  styleUrl: './auth-toggle.css',
})
export class AuthToggle {
  isLoginMode = model<boolean>(true);
}
