import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { Task } from '../../model/task.model';
import { StatusType } from '../../model/status-type.model';
import { TaskActionsService } from '../../services/task-actions.service';
import { TaskService } from '../../services/task.service';
import { TaskRow } from '../task-row/task-row';

@Component({
  selector: 'app-task-table',
  imports: [TaskRow],
  templateUrl: './task-table.html',
})
export class TaskTable implements OnInit {
  tasks = input.required<Task[]>();
  statusTypes = input.required<StatusType[]>();
  showActions = input(true);

  // Emitted after a successful edit/delete so the parent can reload its own list
  refresh = output<void>();

  overdueIds = signal<Set<number>>(new Set());

  private taskActions = inject(TaskActionsService);
  private taskService = inject(TaskService);

  ngOnInit(): void {
    this.loadOverdueIds();
  }

  private loadOverdueIds(): void {
    this.taskService.getOverdueTaskIds().subscribe({
      next: (ids) => this.overdueIds.set(new Set(ids)),
      error: (err) => console.error('Error loading overdue task ids', err),
    });
  }

  openModalForEdit(task: Task): void {
    this.taskActions.openEditModal(task, this.statusTypes(), () => this.refresh.emit());
  }

  deleteTask(task: Task): void {
    this.taskActions.confirmAndDelete(task, () => this.refresh.emit());
  }

  changeStatus(payload: { task: Task; statusTypeId: string }): void {
    this.taskActions.changeStatus(payload.task, payload.statusTypeId, () => {
      this.refresh.emit();
      this.loadOverdueIds();
    });
  }
}
