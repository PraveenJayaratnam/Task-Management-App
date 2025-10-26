import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

export interface ConfirmationDialogData {
  title?: string;
  message?: string;
  confirmText?: string;
  type?: 'destructive' | 'confirm';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    NgClass,
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);

  get title(): string {
    return this.data.title || 'Confirm Action';
  }

  get message(): string {
    return this.data.message || 'Are you sure you want to proceed?';
  }

  get confirmText(): string {
    return this.data.confirmText || 'Confirm';
  }

  get type(): 'destructive' | 'confirm' {
    return this.data.type || 'destructive';
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
