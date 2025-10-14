import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '@core/services';
import { Task } from '@features/task-management/models';
import { TaskService } from '@features/task-management/services';
import { DataResponse, PaginationRequest } from '@shared/models';
import { Subscription } from 'rxjs';
import { TaskFormComponent, TaskListComponent } from '../';

export enum MessageType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [TaskListComponent, TaskFormComponent],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.scss',
})
export class TaskManagementComponent implements OnInit, OnDestroy {
  tasks = signal<Task[]>([]);
  paginationData = signal<DataResponse<Task> | null>(null);
  loading = signal<boolean>(false);
  formLoading = signal<boolean>(false);
  showForm = signal<boolean>(false);
  selectedTask = signal<Task | null>(null);
  message = signal<string>('');
  messageType = signal<MessageType>(MessageType.Info);

  authService = inject(AuthService);
  #taskService = inject(TaskService);
  #subscriptions = new Set<Subscription>();

  #currentPagination: PaginationRequest = {
    pageIndex: 0,
    pageSize: 10,
    sortBy: '',
    sortDirection: 'asc',
    searchTerm: '',
  };

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading.set(true);
    const subscription = this.#taskService.getList(this.#currentPagination).subscribe({
      next: (response: DataResponse<Task>) => {
        this.tasks.set(response.items);
        this.paginationData.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.showMessage('Failed to load tasks', MessageType.Error);
        this.loading.set(false);
      },
    });
    this.#subscriptions.add(subscription);
  }

  onAddTask() {
    this.selectedTask.set(null);
    this.showForm.set(true);
  }

  onEditTask(task: Task) {
    this.selectedTask.set(task);
    this.showForm.set(true);
  }

  onSaveTask(task: Task) {
    this.formLoading.set(true);

    const operation = task.id
      ? this.#taskService.update(Number(task.id), task)
      : this.#taskService.create(task);

    const subscription = operation.subscribe({
      next: () => {
        this.showMessage(
          task.id ? 'Task updated successfully' : 'Task created successfully',
          MessageType.Success
        );
        this.formLoading.set(false);
        this.onCancelForm();
        this.loadTasks();
      },
      error: () => {
        this.showMessage(
          task.id ? 'Failed to update task' : 'Failed to create task',
          MessageType.Error
        );
        this.formLoading.set(false);
      },
    });
    this.#subscriptions.add(subscription);
  }

  onDeleteTask(task: Task) {
    if (!task.id) return;

    const subscription = this.#taskService.remove(task.id).subscribe({
      next: () => {
        this.showMessage('Task deleted successfully', MessageType.Success);
        this.loadTasks();
      },
      error: () => {
        this.showMessage('Failed to delete task', MessageType.Error);
      },
    });
    this.#subscriptions.add(subscription);
  }

  onCancelForm() {
    this.showForm.set(false);
    this.selectedTask.set(null);
  }

  onPageChange(page: number) {
    this.#currentPagination.pageIndex = page;
    this.loadTasks();
  }

  onSearchChange(searchTerm: string) {
    this.#currentPagination.searchTerm = searchTerm;
    this.#currentPagination.pageIndex = 0;
    this.loadTasks();
  }

  onSortChange(sort: { sortBy: string; sortDirection: 'asc' | 'desc' }) {
    this.#currentPagination.sortBy = sort.sortBy;
    this.#currentPagination.sortDirection = sort.sortDirection;
    this.#currentPagination.pageIndex = 0;
    this.loadTasks();
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

  onLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  ngOnDestroy() {
    this.#subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.#subscriptions.clear();
  }
}
