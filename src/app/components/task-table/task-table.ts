import { Component, inject, input, output } from '@angular/core';
import { Task } from '../../model/task.model';
import { StatusType } from '../../model/status-type.model';
import { TaskActionsService } from '../../services/task-actions.service';
import { TaskRow } from '../task-row/task-row';

@Component({
  selector: 'app-task-table',
  imports: [TaskRow],
  templateUrl: './task-table.html',
})
export class TaskTable {
  tasks = input.required<Task[]>();
  statusTypes = input.required<StatusType[]>();
  showActions = input(true);

  // Emitted after a successful edit/delete so the parent can reload its own list
  refresh = output<void>();

  private taskActions = inject(TaskActionsService);

  openModalForEdit(task: Task): void {
    this.taskActions.openEditModal(task, this.statusTypes(), () => this.refresh.emit());
  }

  deleteTask(task: Task): void {
    this.taskActions.confirmAndDelete(task, () => this.refresh.emit());
  }
}
