import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  getTasks() {
    return this.http.get<any[]>('http://localhost:8080/tasks');
  }
}

