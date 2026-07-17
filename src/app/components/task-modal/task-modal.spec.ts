import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TaskModal, TASK_MODAL_DATA } from './task-modal';

describe('TaskModal', () => {
  let component: TaskModal;
  let fixture: ComponentFixture<TaskModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskModal],
      providers: [
        NgbActiveModal,
        { provide: TASK_MODAL_DATA, useValue: { isEditMode: false, statusTypes: [] } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
