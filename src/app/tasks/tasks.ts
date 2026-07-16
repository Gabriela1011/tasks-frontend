import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../model/task.model';
import { DatePipe } from '@angular/common';
import { StatusTypeService } from '../services/status-type.service';
import { StatusType } from '../model/status-type.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskModal } from '../components/task-modal/task-modal';

@Component({
  selector: 'app-tasks',
  imports: [DatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);
  private statusTypeService = inject(StatusTypeService);
  private modalService = inject(NgbModal);
  
  tasks = signal<Task[]>([]);
  statusTypes = signal<StatusType[]>([]);
 
  ngOnInit(): void {
    this.loadTasks();
    this.loadStatuses();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (res) => {
        const sortedTasksByDueDate = res.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;

          return a.dueDate.localeCompare(b.dueDate);
        });
        this.tasks.set(sortedTasksByDueDate);
      },

      error: (err) => console.error('Error loading tasks', err)
    });
  }

  loadStatuses() {
    this.statusTypeService.getAllStatuses().subscribe({
      next: (res) => {
        console.log('Statusuri primite de la server:', res);
        this.statusTypes.set(res);

      },
      error: (err) => console.error('Error loading status types', err)
    });
  }

  openModalForAdd() {
    const modalRef = this.modalService.open(TaskModal, { centered: true, size: 'lg' });
    
    const componentInstance = (modalRef as any)['_contentRef'].componentRef;
    componentInstance.setInput('isEditMode', false);
    componentInstance.setInput('statusTypes', this.statusTypes());

    modalRef.result.then((formData) => {
      if (formData) {
        this.taskService.createTask(formData).subscribe(() => {
          this.loadTasks(); 
        });
      }//TODO: muta in task-modal.ts
    }).catch(() => {/*user dismissed the modal without saving*/});
  }

  

}
