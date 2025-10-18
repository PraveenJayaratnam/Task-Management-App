import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Task,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  TaskPriority,
  TaskStatus,
} from '@features/task-management/models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  task = input<Task | null>(null);
  loading = input<boolean>(false);

  saveTask = output<Task>();
  taskCancel = output<void>();

  isEditMode = signal<boolean>(false);
  submitted = signal<boolean>(false);
  taskStatusOptions = TASK_STATUS_OPTIONS;
  taskPriorityOptions = TASK_PRIORITY_OPTIONS;
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  taskForm!: FormGroup;

  #fb = inject(FormBuilder);

  ngOnInit() {
    this.#initializeForm();
    this.#handlePatch();
  }

  #handlePatch() {
    if (this.task()) {
      this.isEditMode.set(true);
      this.taskForm.patchValue({
        title: this.task()!.title,
        description: this.task()!.description || '',
        status: this.task()!.status,
        priority: this.task()!.priority,
        dueDate: this.task()!.dueDate || '',
      });
    }
  }

  #initializeForm() {
    this.taskForm = this.#fb.group({
      title: ['', Validators.required],
      description: [''],
      status: [TaskStatus.Pending, Validators.required],
      priority: [''],
      dueDate: [''],
    });
  }

  onSubmit() {
    this.submitted.set(true);

    if (this.taskForm.invalid) {
      return;
    }

    const formValue = this.taskForm.getRawValue();
    const taskData: Task = {
      ...formValue,
      id: this.task()?.id,
    };

    this.saveTask.emit(taskData);
  }

  onCancelClick() {
    this.taskCancel.emit();
  }
}
