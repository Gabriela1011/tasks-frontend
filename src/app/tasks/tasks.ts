import { Component, inject, Injector, OnInit, signal } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../model/task.model';
import { DatePipe } from '@angular/common';
import { StatusTypeService } from '../services/status-type.service';
import { StatusType } from '../model/status-type.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskModal, TASK_MODAL_DATA } from '../components/task-modal/task-modal';
import { ConfirmModal } from '../components/confirm-modal/confirm-modal';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-tasks',
  imports: [DatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);
  private statusTypeService = inject(StatusTypeService);
  private modalService = inject(NgbModal);
  private toastService = inject(ToastService);
  private injector = inject(Injector);
  
  tasks = signal<Task[]>([]);
  statusTypes = signal<StatusType[]>([]);
 
  ngOnInit(): void {
    this.loadTasks();
    this.loadStatuses();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (res) => {
        const sortedTasksByDueDate = res.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;

          return a.dueDate.localeCompare(b.dueDate);
        });
        this.tasks.set(sortedTasksByDueDate);
      },

      error: (err) => console.error('Error loading tasks', err)
    });
  }

  loadStatuses() {
    this.statusTypeService.getAllStatuses().subscribe({
      next: (res) => {
        console.log('Statusuri primite de la server:', res);
        this.statusTypes.set(res);

      },
      error: (err) => console.error('Error loading status types', err)
    });
  }

  openModalForAdd() {
    const modalInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: TASK_MODAL_DATA, useValue: { isEditMode: false, statusTypes: this.statusTypes() } },
      ],
    });

    const modalRef = this.modalService.open(TaskModal, { centered: true, size: 'lg', injector: modalInjector });

    modalRef.result.then((formData) => {
      if (formData) {
        this.taskService.createTask(formData).subscribe(() => {
          this.loadTasks();
        });
      }//TODO: muta in task-modal.ts
    }).catch(() => {/*user dismissed the modal without saving*/});
  }

  deleteTask(task: Task) {
    const modalRef = this.modalService.open(ConfirmModal, { centered: true });
    modalRef.componentInstance.title = 'Delete task';
    modalRef.componentInstance.message = `Are you sure you want to delete "${task.taskName}"?`;
    modalRef.componentInstance.confirmText = 'Delete';

    modalRef.result.then((confirmed) => {
      if (confirmed) {
        this.taskService.deleteTask(task.taskId).subscribe({
          next: () => {
            this.toastService.show('Task deleted successfully');
            this.loadTasks();
          },
          error: (err) => {
            console.error('Error deleting task', err);
            this.toastService.show('Failed to delete task', 'danger');
          }
        });
      }
    }).catch(() => {/*user dismissed the modal*/});
  }

}
