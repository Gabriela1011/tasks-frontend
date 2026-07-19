import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { InvalidControl } from './invalid-control';

@Component({
  template: `<input [formControl]="control" />`,
  imports: [ReactiveFormsModule, InvalidControl],
})
class HostComponent {
  control = new FormControl('', { nonNullable: true });
}

describe('InvalidControl', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
