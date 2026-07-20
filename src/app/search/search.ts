import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbInputDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { StatusTypeService } from '../services/status-type.service';
import { UserService } from '../services/user.service';
import { StatusType } from '../model/status-type.model';
import { UserSummaryDTO } from '../model/user.model';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, NgbInputDatepicker],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  private fb = inject(FormBuilder);
  private statusTypeService = inject(StatusTypeService);
  private userService = inject(UserService);

  statusTypes = signal<StatusType[]>([]);
  users = signal<UserSummaryDTO[]>([]);

  searchForm: FormGroup = this.fb.group({
    taskName: [''], ///RENAME: subject to TASK NAME
    userId: [null],
    statusTypeId: [null],
    dueDate: [null as NgbDateStruct | null],
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

  selectStatus(statusTypeId: string | null): void {
    this.searchForm.patchValue({ statusTypeId });
  }

  clearTaskName(): void {
    this.searchForm.patchValue({ taskName: '' });
  }

  clearUser(): void {
    this.searchForm.patchValue({ userId: null });
  }

  clearDueDate(): void {
    this.searchForm.patchValue({ dueDate: null });
  }

  clearAllFilters(): void {
    this.searchForm.reset({ taskName: '', userId: null, statusTypeId: null, dueDate: null });
  }

  hasActiveFilters(): boolean {
    const { taskName, userId, statusTypeId, dueDate } = this.searchForm.value;
    return !!taskName || !!userId || !!statusTypeId || !!dueDate;
  }

  getUserName(userId: number): string {
    return this.users().find((u) => u.userId === userId)?.username ?? '';
  }

  getStatusName(statusTypeId: string): string {
    return this.statusTypes().find((s) => s.statusTypeId === statusTypeId)?.statusName ?? '';
  }

  formatDueDate(date: NgbDateStruct): string {
    return `${String(date.day).padStart(2, '0')}-${String(date.month).padStart(2, '0')}-${date.year}`;
  }
}
