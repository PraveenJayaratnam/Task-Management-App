import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

import {
  CreateTask,
  Task,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  TaskPriority,
  TaskStatus,
  UpdateTask,
} from '../../models/task.model';

export interface TaskDialogData {
  task?: Task;
  isEdit: boolean;
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatFormField,
    MatLabel,
    MatSuffix,
    MatHint,
    MatError,
    MatInput,
    MatSelect,
    MatOption,
    MatDatepicker,
    MatDatepickerToggle,
    MatDatepickerInput,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss',
})
export class TaskDialogComponent implements OnInit {
  #fb = inject(FormBuilder);
  #dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  data: TaskDialogData = inject(MAT_DIALOG_DATA);

  taskForm!: FormGroup;
  statusOptions = TASK_STATUS_OPTIONS;
  priorityOptions = TASK_PRIORITY_OPTIONS;

  ngOnInit() {
    this.#initializeForm();
  }

  #initializeForm() {
    this.taskForm = this.#fb.group({
      title: ['', Validators.required],
      description: [''],
      status: [TaskStatus.Pending, Validators.required],
      priority: [TaskPriority.Low],
      dueDate: [null, Validators.required],
    });

    if (this.data?.isEdit && this.data?.task) {
      this.taskForm.patchValue({
        title: this.data.task.title,
        description: this.data.task.description,
        status: this.data.task.status,
        priority: this.data.task.priority,
        dueDate: this.data.task.dueDate ? new Date(this.data.task.dueDate) : '',
      });
    }
  }

  onSave() {
    this.taskForm.markAllAsTouched();

    if (!this.taskForm.valid) {
      console.log('Form is invalid:', this.taskForm.errors);
      console.log('Form controls:', this.taskForm.controls);
      return;
    }

    const formValue = this.taskForm.value;

    if (this.data.isEdit && this.data.task) {
      const updateTask: UpdateTask = {
        title: formValue.title,
        description: formValue.description,
        status: formValue.status,
        priority: formValue.priority,
        dueDate: formValue.dueDate ? formValue.dueDate.toISOString() : null,
      };
      this.#dialogRef.close({
        action: 'update',
        id: this.data.task.id,
        task: updateTask,
      });
    } else {
      const createTask: CreateTask = {
        title: formValue.title,
        description: formValue.description,
        status: formValue.status,
        priority: formValue.priority,
        dueDate: formValue.dueDate ? formValue.dueDate.toISOString() : null,
      };
      this.#dialogRef.close({ action: 'create', task: createTask });
    }
  }

  onCancel() {
    this.#dialogRef.close({ action: 'cancel' });
  }
}
