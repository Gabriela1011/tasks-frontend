import { Directive, HostBinding, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

// Applies automatically to any [formControlName] input, so callers never
// have to write [class.is-invalid]="form.get('x')?.invalid && ...touched"
// on each field by hand
@Directive({
  selector: '[formControlName], [formControl]',
})
export class InvalidControl {
  private ngControl = inject(NgControl, { self: true });

  @HostBinding('class.is-invalid')
  get isInvalid(): boolean {
    return !!(this.ngControl.invalid && this.ngControl.touched);
  }
}
