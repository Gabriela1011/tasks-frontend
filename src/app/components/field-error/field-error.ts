import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  imports: [],
  template: `
    @if (control()?.invalid && control()?.touched) {
      <small class="text-danger">{{ errorMessage() }}</small>
    }
  `,
})
export class FieldError {
  control = input.required<AbstractControl | null>();
  label = input('This field');

  errorMessage(): string {
    const errors = this.control()?.errors;

    if (!errors) {
      return '';
    }
    if (errors['required']) {
      return `${this.label()} is required.`;
    }
    if (errors['email']) {
      return 'Enter a valid email address.';
    }
    if (errors['minlength']) {
      return `${this.label()} must be at least ${errors['minlength'].requiredLength} characters.`;
    }
    if (errors['maxlength']) {
      return `${this.label()} must be at most ${errors['maxlength'].requiredLength} characters.`;
    }
    return 'Invalid value.';
  }
}
