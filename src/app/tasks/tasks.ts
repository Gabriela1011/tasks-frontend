import { Component, inject, Injector, OnInit, signal } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task, UpdateTaskDTO } from '../model/task.model';
import { DatePipe } from '@angular/common';
import { StatusTypeService } from '../services/status-type.service';
import { StatusType } from '../model/status-type.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskModal, TaskModalData, TASK_MODAL_DATA } from '../components/task-modal/task-modal';
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
    const modalRef = this.openTaskModal({ isEditMode: false, statusTypes: this.statusTypes() });

    modalRef.result.then((formData) => {
      if (formData) {
        this.taskService.createTask(formData).subscribe(() => this.loadTasks());
      }
    }).catch(() => {/* user dismissed the modal without saving */});
  }

  openModalForEdit(task: Task) {
    const modalRef = this.openTaskModal({ isEditMode: true, taskData: task, statusTypes: this.statusTypes() });

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
          this.loadTasks();
        },
        error: (err) => {
          console.error('Error updating task', err);
          this.toastService.show('Failed to update task', 'danger');
        },
      });
    }).catch(() => {/* user dismissed the modal without saving */});
  }

  private openTaskModal(data: TaskModalData) {
    const modalInjector = Injector.create({
      parent: this.injector,
      providers: [{ provide: TASK_MODAL_DATA, useValue: data }],
    });

    return this.modalService.open(TaskModal, { centered: true, size: 'lg', injector: modalInjector });
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
