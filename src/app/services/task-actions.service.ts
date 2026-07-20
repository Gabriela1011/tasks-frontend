import { inject, Injectable, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from './task.service';
import { ToastService } from './toast.service';
import { Task, UpdateTaskDTO } from '../model/task.model';
import { StatusType } from '../model/status-type.model';
import { TaskModal, TaskModalData, TASK_MODAL_DATA } from '../components/task-modal/task-modal';
import { ConfirmModal } from '../components/confirm-modal/confirm-modal';

/**
 * Centralizes the add / edit / delete task flows (modal + API call + toast)
 */
@Injectable({ providedIn: 'root' })
export class TaskActionsService {
  private modalService = inject(NgbModal);
  private taskService = inject(TaskService);
  private toastService = inject(ToastService);
  private injector = inject(Injector);

  openAddModal(statusTypes: StatusType[], onDone: () => void): void {
    const modalRef = this.openTaskModal({ isEditMode: false, statusTypes });

    modalRef.result.then((formData) => {
      if (!formData) {
        return;
      }
      this.taskService.createTask(formData).subscribe({
        next: () => {
          this.toastService.show('Task created successfully');
          onDone();
        },
        error: (err) => {
          console.error('Error creating task', err);
          this.toastService.show('Failed to create task', 'danger');
        },
      });
    }).catch(() => {/* user dismissed the modal without saving */});
  }

  openEditModal(task: Task, statusTypes: StatusType[], onDone: () => void): void {
    const modalRef = this.openTaskModal({ isEditMode: true, taskData: task, statusTypes });

    modalRef.result.then((formData) => {
      if (!formData) {
        return;
      }
      const payload: UpdateTaskDTO = {
        taskName: formData.taskName,
        content: formData.content,
        dueDate: formData.dueDate,
      };
      this.taskService.updateTask(task.taskId, payload).subscribe({
        next: () => {
          this.toastService.show('Task updated successfully');
          onDone();
        },
        error: (err) => {
          console.error('Error updating task', err);
          this.toastService.show('Failed to update task', 'danger');
        },
      });
    }).catch(() => {/* user dismissed the modal without saving */});
  }

  confirmAndDelete(task: Task, onDone: () => void): void {
    const modalRef = this.modalService.open(ConfirmModal, { centered: true });
    modalRef.componentInstance.title = 'Delete task';
    modalRef.componentInstance.message = `Are you sure you want to delete "${task.taskName}"?`;
    modalRef.componentInstance.confirmText = 'Delete';

    modalRef.result.then((confirmed) => {
      if (!confirmed) {
        return;
      }
      this.taskService.deleteTask(task.taskId).subscribe({
        next: () => {
          this.toastService.show('Task deleted successfully');
          onDone();
        },
        error: (err) => {
          console.error('Error deleting task', err);
          this.toastService.show('Failed to delete task', 'danger');
        },
      });
    }).catch(() => {/* user dismissed the modal */});
  }

  private openTaskModal(data: TaskModalData) {
    const modalInjector = Injector.create({
      parent: this.injector,
      providers: [{ provide: TASK_MODAL_DATA, useValue: data }],
    });

    return this.modalService.open(TaskModal, { centered: true, size: 'lg', injector: modalInjector });
  }
}
