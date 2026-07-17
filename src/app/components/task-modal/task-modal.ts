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
    this.taskForm = this.fb.group({
      taskName: ['', [Validators.required, Validators.maxLength(500)]],
      content: ['', Validators.maxLength(4000)],
      dueDate: [''],
      statusTypeId: ['', Validators.required]
    });
    
    //add task mode
    if(!this.isEditMode()) {
      const currentStatuses = this.statusTypes();
      const pendingStatus = currentStatuses.find(status => status.statusName.toUpperCase() === 'PENDING');

      if(pendingStatus) {
        this.taskForm.patchValue({ statusTypeId: pendingStatus.statusTypeId });
      } else if (currentStatuses.length > 0) {
        this.taskForm.patchValue({ statusTypeId: currentStatuses[0].statusTypeId });
      }
    }

    //edit task mode
    if(this.isEditMode() && this.taskData()) {
      const task = this.taskData()!;

      let formattedDate = '';
      if (task.dueDate) {
        formattedDate = task.dueDate.substring(0, 16); 
      }
      
      this.taskForm.patchValue({
        taskName: task.taskName,
        content: task.content || '',
        dueDate: formattedDate
      });
    }
  }

  save() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    
    this.activeModal.close(this.taskForm.value);
  }

  dismissModal() {
    this.activeModal.dismiss();
  }
  
  getStatusName(statusTypeId: number | string): string {
    const status = this.statusTypes().find(s => s.statusTypeId === statusTypeId);
    return status ? status.statusName : 'Unknown';
  }
  
}
