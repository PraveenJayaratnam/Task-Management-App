import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
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
import { ConfirmationDialogComponent } from '@shared/components';
import { Subscription } from 'rxjs';
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
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    ReactiveFormsModule,
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss',
})
export class TaskDialogComponent implements OnInit, OnDestroy {
  #fb = inject(FormBuilder);
  #dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  #dialog = inject(MatDialog);
  #subscriptions = new Set<Subscription>();
  data: TaskDialogData = inject(MAT_DIALOG_DATA);

  taskForm!: FormGroup;
  statusOptions = TASK_STATUS_OPTIONS;
  priorityOptions = TASK_PRIORITY_OPTIONS;
  saveAttempted = false;

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
        dueDate: this.data.task.dueDate
          ? typeof this.data.task.dueDate === 'string'
            ? new Date(this.data.task.dueDate)
            : this.data.task.dueDate
          : null,
      });
    }
  }

  onSave() {
    this.saveAttempted = true;
    this.taskForm.markAllAsTouched();

    if (!this.taskForm.valid) {
      return;
    }

    const formValue = this.taskForm.value;

    if (this.data.isEdit && this.data.task) {
      const updateTask: UpdateTask = {
        title: formValue.title,
        description: formValue.description,
        status: formValue.status,
        priority: formValue.priority,
        dueDate: formValue.dueDate
          ? formValue.dueDate instanceof Date
            ? formValue.dueDate.toISOString()
            : formValue.dueDate
          : undefined,
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
        dueDate: formValue.dueDate
          ? formValue.dueDate instanceof Date
            ? formValue.dueDate.toISOString()
            : formValue.dueDate
          : undefined,
      };
      this.#dialogRef.close({ action: 'create', task: createTask });
    }
  }

  #hasUnsavedChanges(): boolean {
    return this.taskForm.dirty;
  }

  onCancel() {
    if (this.#hasUnsavedChanges()) {
      const dialogRef = this.#dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Unsaved Changes',
          message: 'You have unsaved changes. Are you sure you want to cancel?',
          confirmText: 'Yes, Cancel',
        },
        width: '400px',
      });

      const subscription = dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.#dialogRef.close({ action: 'cancel' });
        }
      });
      this.#subscriptions.add(subscription);
    } else {
      this.#dialogRef.close({ action: 'cancel' });
    }
  }

  ngOnDestroy() {
    this.#subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.#subscriptions.clear();
  }
}
