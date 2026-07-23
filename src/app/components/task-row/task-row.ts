import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '../../model/task.model';
import { StatusType } from '../../model/status-type.model';

@Component({
  selector: 'tr[app-task-row]',
  imports: [DatePipe],
  templateUrl: './task-row.html',
})
export class TaskRow {
  task = input.required<Task>();
  statusTypes = input.required<StatusType[]>();
  showActions = input(false);
  isOverdue = input(false);
  edit = output<Task>();
  delete = output<Task>();
  statusChange = output<{ task: Task; statusTypeId: string }>();

  onStatusChange(event: Event): void {
    const statusTypeId = (event.target as HTMLSelectElement).value;
    this.statusChange.emit({ task: this.task(), statusTypeId });
  }
}
