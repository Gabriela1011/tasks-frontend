import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModal {
  activeModal = inject(NgbActiveModal);

  // Set by the caller via modalRef.componentInstance before the modal opens
  title = 'Confirm';
  message = 'Are you sure?';
  confirmText = 'Confirm';
}
