import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task, CreateTaskDTO } from '../model/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/tasks'

  getTasks() {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(taskPayload: CreateTaskDTO) {
    return this.http.post<Task>(this.apiUrl, taskPayload);
  }

  deleteTask(taskId: number) {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }
}

