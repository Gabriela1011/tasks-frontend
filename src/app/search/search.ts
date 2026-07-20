import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbInputDatepicker, NgbDateStruct, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { StatusTypeService } from '../services/status-type.service';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';
import { StatusType } from '../model/status-type.model';
import { UserSummaryDTO } from '../model/user.model';
import { Task } from '../model/task.model';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, NgbInputDatepicker, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  private fb = inject(FormBuilder);
  private statusTypeService = inject(StatusTypeService);
  private userService = inject(UserService);
  private taskService = inject(TaskService);

  statusTypes = signal<StatusType[]>([]);
  users = signal<UserSummaryDTO[]>([]);
  selectedStatuses = signal<Set<string>>(new Set());
  selectedUserIds = signal<Set<number>>(new Set());
  searchResults = signal<Task[]>([]);
  searched = signal<boolean>(false);

  searchForm: FormGroup = this.fb.group({
    taskName: [''],
    dueDateFrom: [null as NgbDateStruct | null],
    dueDateTo: [null as NgbDateStruct | null],
  });

  ngOnInit(): void {
    this.statusTypeService.getAllStatuses().subscribe({
      next: (res) => this.statusTypes.set(res),
      error: (err) => console.error('Error loading status types', err),
    });

    this.userService.getUserSummaries().subscribe({
      next: (res) => this.users.set(res),
      error: (err) => console.error('Error loading users', err),
    });
  }

  toggleStatus(statusTypeId: string): void {
    this.selectedStatuses.update(set => {
      const next = new Set(set);
      next.has(statusTypeId) ? next.delete(statusTypeId) : next.add(statusTypeId);
      return next;
    });
  }

  toggleUser(userId: number): void {
    this.selectedUserIds.update(set => {
      const next = new Set(set);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  }

  removeStatus(statusTypeId: string): void {
    this.selectedStatuses.update(set => {
      const next = new Set(set);
      next.delete(statusTypeId);
      return next;
    });
  }

  removeUser(userId: number): void {
    this.selectedUserIds.update(set => {
      const next = new Set(set);
      next.delete(userId);
      return next;
    });
  }

  clearStatuses(): void {
    this.selectedStatuses.set(new Set());
  }

  clearTaskName(): void {
    this.searchForm.patchValue({ taskName: '' });
  }

  clearDateRange(): void {
    this.searchForm.patchValue({ dueDateFrom: null, dueDateTo: null });
  }

  clearAllFilters(): void {
    this.searchForm.reset({ taskName: '', dueDateFrom: null, dueDateTo: null });
    this.selectedStatuses.set(new Set());
    this.selectedUserIds.set(new Set());
  }

  hasActiveFilters(): boolean {
    const { taskName, dueDateFrom, dueDateTo } = this.searchForm.value;
    return !!taskName || !!dueDateFrom || !!dueDateTo
      || this.selectedStatuses().size > 0
      || this.selectedUserIds().size > 0;
  }

  getUserName(userId: number): string {
    return this.users().find((u) => u.userId === userId)?.username ?? '';
  }

  getStatusName(statusTypeId: string): string {
    return this.statusTypes().find((s) => s.statusTypeId === statusTypeId)?.statusName ?? '';
  }

  formatDate(date: NgbDateStruct): string {
    return `${String(date.day).padStart(2, '0')}-${String(date.month).padStart(2, '0')}-${date.year}`;
  }

  onSearch(): void {
    const { dueDateFrom, dueDateTo } = this.searchForm.value;
    
    this.taskService.searchTasks({
      taskName: this.searchForm.value.taskName || undefined,
      userIds: this.selectedUserIdsArray.length ? this.selectedUserIdsArray : undefined,
      statuses: this.selectedStatusesArray.length ? this.selectedStatusesArray : undefined,
      dueDateFrom: dueDateFrom ? this.formatDateForApi(dueDateFrom) : undefined,
      dueDateTo: dueDateTo ? this.formatDateForApi(dueDateTo) : undefined,
    }).subscribe({
      next: (res) => {
        console.log('Search results:', res);
        this.searchResults.set(res);
        this.searched.set(true);
      },
      error: (err) => console.error('Search failed', err),
    });
  }

  private formatDateForApi(date: NgbDateStruct): string {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }

  get selectedStatusesArray(): string[] {
    return Array.from(this.selectedStatuses());
  }

  get selectedUserIdsArray(): number[] {
    return Array.from(this.selectedUserIds());
  }
}
