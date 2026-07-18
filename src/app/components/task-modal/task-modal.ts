import { Component, inject, InjectionToken, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../../model/task.model';
import { StatusType } from '../../model/status-type.model';

export interface TaskModalData {
  isEditMode: boolean;
  taskData?: Task;
  statusTypes: StatusType[];
}


export const TASK_MODAL_DATA = new InjectionToken<TaskModalData>('TASK_MODAL_DATA');

@Component({
  selector: 'app-task-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.css',
})
export class TaskModal implements OnInit {
  activeModal = inject(NgbActiveModal);
  private fb = inject(FormBuilder);
  private data = inject(TASK_MODAL_DATA);

  isEditMode = signal(this.data.isEditMode);
  taskData = signal(this.data.taskData);
  statusTypes = signal(this.data.statusTypes);

  taskForm!: FormGroup;

  ngOnInit(): void {
    this.taskForm = this.buildForm();

    if (this.isEditMode()) {
      this.patchFormFromTask();
    } else {
      this.preselectDefaultStatus();
    }
  }

  save(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.activeModal.close(this.taskForm.value);
  }

  dismissModal(): void {
    this.activeModal.dismiss();
  }

  private buildForm(): FormGroup {
    // Status is chosen only when creating a task
    // changing it afterwards goes through a separate endpoint, so it isn't required when editing
    return this.fb.group({
      taskName: ['', [Validators.required, Validators.maxLength(500)]],
      content: ['', Validators.maxLength(4000)],
      dueDate: [''],
      statusTypeId: ['', this.isEditMode() ? [] : [Validators.required]],
    });
  }

  private patchFormFromTask(): void {
    const task = this.taskData();
    if (!task) {
      return;
    }

    this.taskForm.patchValue({
      taskName: task.taskName,
      content: task.content ?? '',
      dueDate: task.dueDate ? task.dueDate.substring(0, 16) : '',
    });
  }

  private preselectDefaultStatus(): void {
    const statuses = this.statusTypes();
    const defaultStatus = statuses.find((status) => status.statusName.toUpperCase() === 'PENDING') ?? statuses[0];

    if (defaultStatus) {
      this.taskForm.patchValue({ statusTypeId: defaultStatus.statusTypeId });
    }
  }
}
