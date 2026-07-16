import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../model/task.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tasks',
  imports: [DatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);
  tasks = signal<Task[]>([]);
 
  ngOnInit(): void {
    this.taskService.getTasks().subscribe(res => {
      const sortedTasksByDueDate = res.sort((a, b) => {
        if(!a.dueDate && !b.dueDate) return 0;
        if(!a.dueDate) return 1;
        if(!b.dueDate) return -1;

        return a.dueDate.localeCompare(b.dueDate);
      });

      this.tasks.set(sortedTasksByDueDate);
      console.log('Tasks fetched:', this.tasks());
    });
  }
}
