import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task, CreateTaskDTO, UpdateTaskDTO, UpdateTaskStatusDTO, TaskSearchParams } from '../model/task.model';

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

  updateTask(taskId: number, taskPayload: UpdateTaskDTO) {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}`, taskPayload);
  }

  updateTaskStatus(taskId: number, statusPayload: UpdateTaskStatusDTO) {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/status`, statusPayload);
  }

  deleteTask(taskId: number) {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }

  getOverdueTaskIds() {
    return this.http.get<number[]>(`${this.apiUrl}/overdue`);
  }

  searchTasks(params: TaskSearchParams) {
    let httpParams = new HttpParams();

    if (params.taskName) {
      httpParams = httpParams.set('taskName', params.taskName);
    }
      
    params.userIds?.forEach(id => httpParams = httpParams.append('userIds', id.toString()));
    params.statuses?.forEach(s => httpParams = httpParams.append('statuses', s));

    if (params.dueDateFrom) {
      httpParams = httpParams.set('dueDateFrom', params.dueDateFrom);
    } 

    if (params.dueDateTo) {
      httpParams = httpParams.set('dueDateTo', params.dueDateTo);
    } 
    
    return this.http.get<Task[]>(`${this.apiUrl}/search`, { params: httpParams });
  }
}

