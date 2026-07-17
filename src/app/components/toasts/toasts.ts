import { Component, inject } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { Toast, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toasts',
  imports: [NgbToast],
  templateUrl: './toasts.html',
})
export class Toasts {
  protected toastService = inject(ToastService);
  toasts = this.toastService.toasts;

  remove(toast: Toast) {
    this.toastService.remove(toast);
  }
}
