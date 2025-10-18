import { DatePipe } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  Task,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  TaskPriority,
  TaskStatus,
} from '@features/task-management/models';
import { DataResponse } from '@shared/models';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  tasks = input<Task[]>([]);
  paginationData = input<DataResponse<Task> | null>(null);
  loading = input<boolean>(false);

  editTask = output<Task>();
  deleteTask = output<Task>();
  pageChange = output<number>();
  searchChange = output<string>();
  sortChange = output<{
    sortBy: string;
    sortDirection: 'asc' | 'desc';
  }>();

  filterForm!: FormGroup;
  Math = Math;
  taskStatusOptions = TASK_STATUS_OPTIONS;
  taskPriorityOptions = TASK_PRIORITY_OPTIONS;

  #fb = inject(FormBuilder);

  ngOnInit() {
    this.#initializeForm();
    this.#handleSearchChange();
    this.#handleSortChange();
  }

  #initializeForm() {
    this.filterForm = this.#fb.group({
      searchTerm: [''],
      sortBy: [''],
      sortDirection: ['asc'],
    });
  }

  #handleSearchChange() {
    this.filterForm.get('searchTerm')?.valueChanges.subscribe((value) => {
      this.searchChange.emit(value);
    });
  }

  #handleSortChange() {
    this.filterForm.get('sortBy')?.valueChanges.subscribe(() => {
      this.#emitSortChange();
    });

    this.filterForm.get('sortDirection')?.valueChanges.subscribe(() => {
      this.#emitSortChange();
    });
  }

  onEdit(task: Task) {
    this.editTask.emit(task);
  }

  onDelete(task: Task) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.deleteTask.emit(task);
    }
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  #emitSortChange() {
    const sortBy = this.filterForm.get('sortBy')?.value || '';
    const sortDirection = (this.filterForm.get('sortDirection')?.value || 'asc') as
      | 'asc'
      | 'desc';

    this.sortChange.emit({
      sortBy,
      sortDirection,
    });
  }

  getStatusClass(status: TaskStatus): string {
    const option = this.taskStatusOptions.find((opt) => opt.value === status);
    return option?.cssClass || 'secondary';
  }

  getStatusLabel(status: TaskStatus): string {
    const option = this.taskStatusOptions.find((opt) => opt.value === status);
    return option?.label || 'Unknown';
  }

  getPriorityClass(priority: TaskPriority | undefined): string {
    if (priority === undefined) return 'secondary';
    const option = this.taskPriorityOptions.find((opt) => opt.value === priority);
    return option?.cssClass || 'secondary';
  }

  getPriorityLabel(priority: TaskPriority | undefined): string {
    if (priority === undefined) return 'Not Set';
    const option = this.taskPriorityOptions.find((opt) => opt.value === priority);
    return option?.label || 'Unknown';
  }
}
