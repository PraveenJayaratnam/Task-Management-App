import { BaseEntity } from '@core/models';

export enum TaskStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
}

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
}

export interface TaskStatusOption {
  value: TaskStatus;
  label: string;
  cssClass: string;
}

export interface TaskPriorityOption {
  value: TaskPriority;
  label: string;
  cssClass: string;
}

export const TASK_STATUS_OPTIONS: TaskStatusOption[] = [
  { value: TaskStatus.Pending, label: 'Pending', cssClass: 'warning' },
  { value: TaskStatus.InProgress, label: 'In Progress', cssClass: 'info' },
  { value: TaskStatus.Completed, label: 'Completed', cssClass: 'success' },
  { value: TaskStatus.Cancelled, label: 'Cancelled', cssClass: 'danger' },
];

export const TASK_PRIORITY_OPTIONS: TaskPriorityOption[] = [
  { value: TaskPriority.Low, label: 'Low', cssClass: 'secondary' },
  { value: TaskPriority.Medium, label: 'Medium', cssClass: 'primary' },
  { value: TaskPriority.High, label: 'High', cssClass: 'warning' },
  { value: TaskPriority.Critical, label: 'Critical', cssClass: 'danger' },
];

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface CreateTask {
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}
