import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelect } from '@angular/material/select';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  Task,
  TaskPriority,
  TaskStatus,
} from '@features/task-management/models';
import { TaskService } from '@features/task-management/services';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { DataResponse } from '@shared/models';
import { Subscription } from 'rxjs';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    DatePipe,
    MatButton,
    MatCard,
    MatCardContent,
    MatCell,
    MatCellDef,
    MatChip,
    MatChipSet,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatInput,
    MatLabel,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatNoDataRow,
    MatOption,
    MatPaginator,
    MatProgressSpinner,
    MatRow,
    MatRowDef,
    MatSelect,
    MatSort,
    MatSortHeader,
    MatSuffix,
    MatTable,
    ReactiveFormsModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy {
  sort = viewChild(MatSort);

  tasks = input<Task[]>([]);
  paginationData = input<DataResponse<Task> | null>(null);
  loading = input<boolean>(false);
  currentSort = input<{ sortBy: string; sortDirection: 'asc' | 'desc' } | null>(null);

  addTask = output<void>();
  editTask = output<Task>();
  deleteTask = output<Task>();
  pageChange = output<PageEvent>();
  searchChange = output<string>();
  statusFilterChange = output<number | null>();
  priorityFilterChange = output<number | null>();
  sortChange = output<{
    sortBy: string;
    sortDirection: 'asc' | 'desc';
  }>();
  refreshTasks = output<void>();

  filterForm!: FormGroup;
  Math = Math;
  taskStatusOptions = TASK_STATUS_OPTIONS;
  taskPriorityOptions = TASK_PRIORITY_OPTIONS;

  displayedColumns: string[] = [
    'actions',
    'title',
    'description',
    'status',
    'priority',
    'dueDate',
  ];

  #fb = inject(FormBuilder);
  #dialog = inject(MatDialog);
  #taskService = inject(TaskService);
  #subscriptions = new Set<Subscription>();

  ngOnInit() {
    this.#initializeForm();
    this.#handleSearchChange();
    this.#handleStatusFilterChange();
    this.#handlePriorityFilterChange();
    this.#handleSortChange();
  }

  ngAfterViewInit() {
    if (this.currentSort()) {
      this.setSortState(this.currentSort()!.sortBy, this.currentSort()!.sortDirection);
    }
  }

  #initializeForm() {
    this.filterForm = this.#fb.group({
      searchTerm: [''],
      statusFilter: [''],
      priorityFilter: [''],
      sortBy: [''],
      sortDirection: ['asc'],
    });
  }

  #handleSearchChange() {
    const subscription = this.filterForm
      .get('searchTerm')
      ?.valueChanges.subscribe((value) => {
        this.searchChange.emit(value);
      });
    if (subscription) {
      this.#subscriptions.add(subscription);
    }
  }

  #handleStatusFilterChange() {
    const subscription = this.filterForm
      .get('statusFilter')
      ?.valueChanges.subscribe((value) => {
        this.statusFilterChange.emit(value || null);
      });
    if (subscription) {
      this.#subscriptions.add(subscription);
    }
  }

  #handlePriorityFilterChange() {
    const subscription = this.filterForm
      .get('priorityFilter')
      ?.valueChanges.subscribe((value) => {
        this.priorityFilterChange.emit(value || null);
      });
    if (subscription) {
      this.#subscriptions.add(subscription);
    }
  }

  #handleSortChange() {
    const sortBySubscription = this.filterForm
      .get('sortBy')
      ?.valueChanges.subscribe(() => {
        this.#emitSortChange();
      });
    if (sortBySubscription) {
      this.#subscriptions.add(sortBySubscription);
    }

    const sortDirectionSubscription = this.filterForm
      .get('sortDirection')
      ?.valueChanges.subscribe(() => {
        this.#emitSortChange();
      });
    if (sortDirectionSubscription) {
      this.#subscriptions.add(sortDirectionSubscription);
    }
  }

  onResetFilters() {
    this.filterForm.patchValue({
      searchTerm: '',
      statusFilter: '',
      priorityFilter: '',
      sortBy: '',
      sortDirection: 'asc',
    });
  }

  onRefreshTasks() {
    this.refreshTasks.emit();
  }

  onAdd() {
    const dialogRef = this.#dialog.open(TaskDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true,
      data: {
        isEdit: false,
      },
    });

    const dialogSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === 'create') {
        const createSubscription = this.#taskService.create(result.task).subscribe({
          next: () => {
            this.addTask.emit();
          },
          error: (error) => {
            console.error('Error creating task:', error);
          },
        });
        this.#subscriptions.add(createSubscription);
      }
    });
    this.#subscriptions.add(dialogSubscription);
  }

  onEdit(task: Task) {
    const dialogRef = this.#dialog.open(TaskDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true,
      data: {
        task: task,
        isEdit: true,
      },
    });

    const dialogSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === 'update') {
        const updateSubscription = this.#taskService
          .update(result.id, result.task)
          .subscribe({
            next: () => {
              this.editTask.emit({ id: result.id, ...result.task });
            },
            error: (error) => {
              console.error('Error updating task:', error);
            },
          });
        this.#subscriptions.add(updateSubscription);
      }
    });
    this.#subscriptions.add(dialogSubscription);
  }

  onDelete(task: Task) {
    const dialogRef = this.#dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      },
    });

    const dialogSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteTask.emit(task);
      }
    });
    this.#subscriptions.add(dialogSubscription);
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  onSortChange(event: Sort) {
    let backendSortBy = event.active;
    if (event.active === 'title') {
      backendSortBy = 'title';
    } else if (event.active === 'status') {
      backendSortBy = 'status';
    } else if (event.active === 'priority') {
      backendSortBy = 'priority';
    } else if (event.active === 'dueDate') {
      backendSortBy = 'duedate';
    }

    let sortDirection: 'asc' | 'desc' = 'asc';

    const currentSort = this.currentSort();
    if (currentSort && currentSort.sortBy === backendSortBy) {
      sortDirection = currentSort.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortDirection = 'asc';
    }

    this.sortChange.emit({
      sortBy: backendSortBy,
      sortDirection: sortDirection,
    });
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

  setSortState(sortBy: string, sortDirection: 'asc' | 'desc') {
    const sortRef = this.sort();
    if (sortRef) {
      let frontendSortBy = sortBy;
      if (sortBy === 'title') {
        frontendSortBy = 'title';
      } else if (sortBy === 'status') {
        frontendSortBy = 'status';
      } else if (sortBy === 'priority') {
        frontendSortBy = 'priority';
      } else if (sortBy === 'duedate') {
        frontendSortBy = 'dueDate';
      }

      sortRef.sort({ id: '', start: 'asc', disableClear: false });

      sortRef.sort({
        id: frontendSortBy,
        start: sortDirection,
        disableClear: false,
      });
    }
  }

  ngOnDestroy() {
    this.#subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.#subscriptions.clear();
  }
}
