import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../model/task.model';
import { StatusTypeService } from '../services/status-type.service';
import { StatusType } from '../model/status-type.model';
import { TaskActionsService } from '../services/task-actions.service';
import { TaskTable } from '../components/task-table/task-table';

@Component({
  selector: 'app-tasks',
  imports: [TaskTable],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);
  private statusTypeService = inject(StatusTypeService);
  private taskActions = inject(TaskActionsService);

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
      next: (res) => this.statusTypes.set(res),
      error: (err) => console.error('Error loading status types', err)
    });
  }

  openModalForAdd() {
    this.taskActions.openAddModal(this.statusTypes(), () => this.loadTasks());
  }
}
