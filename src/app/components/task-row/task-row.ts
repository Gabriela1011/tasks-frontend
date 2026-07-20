import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '../../model/task.model';

@Component({
  selector: 'tr[app-task-row]',
  imports: [DatePipe],
  templateUrl: './task-row.html',
})
export class TaskRow {
  task = input.required<Task>();
  showActions = input(false);
  edit = output<Task>();
  delete = output<Task>();
}
