import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Task, TaskFilter, TaskStatus } from '@features/task-management/models';
import { TaskService } from '@features/task-management/services';
import { MessageType } from '@shared/enums';
import { DataResponse } from '@shared/models';
import { catchError, of, Subscription } from 'rxjs';
import { TaskDialogComponent, TaskListComponent } from '../../components';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [TaskListComponent],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.scss',
})
export class TaskManagementComponent implements OnInit, OnDestroy {
  tasks = signal<Task[]>([]);
  paginationData = signal<DataResponse<Task> | null>(null);
  loading = signal<boolean>(false);
  message = signal<string>('');
  messageType = signal<MessageType>(MessageType.Info);

  #taskService = inject(TaskService);
  #dialog = inject(MatDialog);
  #subscriptions = new Set<Subscription>();

  #appliedFilter: TaskFilter = {
    pageIndex: 0,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    searchTerm: '',
    status: undefined,
    priority: undefined,
  };

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading.set(true);
    const subscription = this.#taskService
      .getList(this.#appliedFilter)
      .pipe(
        catchError(() => {
          this.showMessage('Failed to load tasks', MessageType.Error);
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe({
        next: (response: DataResponse<Task> | null) => {
          if (response) {
            this.tasks.set(response.items);
            this.paginationData.set(response);
          }
          this.loading.set(false);
        },
      });
    this.#subscriptions.add(subscription);
  }

  onAddTask() {
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
        const createSubscription = this.#taskService
          .create(result.task)
          .pipe(
            catchError(() => {
              this.showMessage('Failed to create task', MessageType.Error);
              return of(null);
            })
          )
          .subscribe({
            next: (response) => {
              if (response !== null) {
                this.showMessage('Task created successfully', MessageType.Success);
                this.loadTasks();
              }
            },
          });
        this.#subscriptions.add(createSubscription);
      }
    });
    this.#subscriptions.add(dialogSubscription);
  }

  onEditTask(task: Task) {
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
          .pipe(
            catchError(() => {
              this.showMessage('Failed to update task', MessageType.Error);
              return of(null);
            })
          )
          .subscribe({
            next: (response) => {
              if (response !== null) {
                this.showMessage('Task updated successfully', MessageType.Success);
                this.loadTasks();
              }
            },
          });
        this.#subscriptions.add(updateSubscription);
      }
    });
    this.#subscriptions.add(dialogSubscription);
  }

  onDeleteTask(task: Task) {
    if (!task.id) return;

    const subscription = this.#taskService
      .delete(task.id)
      .pipe(
        catchError(() => {
          this.showMessage('Failed to delete task', MessageType.Error);
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          if (response !== null) {
            this.showMessage('Task deleted successfully', MessageType.Success);
            this.loadTasks();
          }
        },
      });
    this.#subscriptions.add(subscription);
  }

  onMarkAsCompleted(task: Task) {
    if (!task.id) return;

    const updateTask = {
      ...task,
      status: TaskStatus.Completed,
    };

    const subscription = this.#taskService
      .update(task.id, updateTask)
      .pipe(
        catchError(() => {
          this.showMessage('Failed to mark task as completed', MessageType.Error);
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          if (response !== null) {
            this.showMessage(
              'Task marked as completed successfully',
              MessageType.Success
            );
            this.loadTasks();
          }
        },
      });
    this.#subscriptions.add(subscription);
  }

  onPageChange(event: PageEvent) {
    this.#appliedFilter.pageIndex = event.pageIndex;
    this.#appliedFilter.pageSize = event.pageSize;
    this.loadTasks();
  }

  onSearchChange(searchTerm: string) {
    this.#appliedFilter.searchTerm = searchTerm;
    this.#appliedFilter.pageIndex = 0;
    this.loadTasks();
  }

  onStatusFilterChange(status: number | null) {
    this.#appliedFilter.status = status || undefined;
    this.#appliedFilter.pageIndex = 0;
    this.loadTasks();
  }

  onPriorityFilterChange(priority: number | null) {
    this.#appliedFilter.priority = priority || undefined;
    this.#appliedFilter.pageIndex = 0;
    this.loadTasks();
  }

  onSortChange(sort: { sortBy: string; sortDirection: 'asc' | 'desc' }) {
    if (!sort.sortBy || sort.sortBy === '') {
      this.#appliedFilter.sortBy = 'createdAt';
      this.#appliedFilter.sortDirection = 'desc';
    } else {
      this.#appliedFilter.sortBy = sort.sortBy;
      this.#appliedFilter.sortDirection = sort.sortDirection;
    }
    this.#appliedFilter.pageIndex = 0;
    this.loadTasks();
  }

  getCurrentSort() {
    if (this.#appliedFilter.sortBy && this.#appliedFilter.sortDirection) {
      return {
        sortBy: this.#appliedFilter.sortBy,
        sortDirection: this.#appliedFilter.sortDirection,
      };
    }
    return null;
  }

  showMessage(text: string, type: MessageType) {
    this.message.set(text);
    this.messageType.set(type);

    if (type === MessageType.Success) {
      setTimeout(() => this.clearMessage(), 3000);
    }
  }

  clearMessage() {
    this.message.set('');
  }

  ngOnDestroy() {
    this.#subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.#subscriptions.clear();
  }
}
