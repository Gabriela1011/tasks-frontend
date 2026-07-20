import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskSearchParams } from '../model/task.model';

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

  deleteTask(taskId: number) {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
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

