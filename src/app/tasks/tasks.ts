import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-tasks',
  imports: [],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);
  tasks = signal<any[]>([]);
 
  ngOnInit(): void {
    this.taskService.getTasks().subscribe(res => {
      this.tasks.set(res);
      console.log('Tasks fetched:', this.tasks());
    });
  }
}
