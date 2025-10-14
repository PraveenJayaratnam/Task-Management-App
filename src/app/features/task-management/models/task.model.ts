export enum TaskStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
}

export interface TaskStatusOption {
  value: TaskStatus;
  label: string;
  cssClass: string;
}

export const TASK_STATUS_OPTIONS: TaskStatusOption[] = [
  { value: TaskStatus.Pending, label: 'Pending', cssClass: 'warning' },
  { value: TaskStatus.InProgress, label: 'In Progress', cssClass: 'info' },
  { value: TaskStatus.Completed, label: 'Completed', cssClass: 'success' },
  { value: TaskStatus.Cancelled, label: 'Cancelled', cssClass: 'danger' },
];

export interface Task {
  id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
}

export interface TaskEntity extends Task {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
