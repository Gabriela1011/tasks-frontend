import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'danger';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'success') {
    this.toasts.update((current) => [...current, { message, type }]);
  }

  remove(toast: Toast) {
    this.toasts.update((current) => current.filter((t) => t !== toast));
  }
}
