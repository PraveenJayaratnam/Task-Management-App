import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { User } from '@core/models';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';

export interface UserEditDialogData {
  user: User;
}

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatCheckbox,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
  ],
  templateUrl: './user-edit-dialog.component.html',
  styleUrl: './user-edit-dialog.component.scss',
})
export class UserEditDialogComponent implements OnInit {
  #fb = inject(FormBuilder);
  #dialogRef = inject(MatDialogRef<UserEditDialogComponent>);
  #dialog = inject(MatDialog);
  data: UserEditDialogData = inject(MAT_DIALOG_DATA);

  userForm!: FormGroup;
  saveAttempted = false;

  ngOnInit() {
    this.#initializeForm();
    this.#patchForm();
  }

  #initializeForm() {
    this.userForm = this.#fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-zA-Z0-9_]+$/),
        ],
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      isActive: [true],
    });
  }

  #patchForm() {
    this.userForm.patchValue({
      username: this.data.user.username,
      firstName: this.data.user.firstName,
      lastName: this.data.user.lastName,
      isActive: this.data.user.isActive,
    });
  }

  onSave() {
    this.saveAttempted = true;
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      this.#dialogRef.close({
        action: 'update',
        user: {
          id: this.data.user.id,
          username: formValue.username,
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          isActive: formValue.isActive,
        },
      });
    }
  }

  onCancel() {
    if (this.userForm.dirty) {
      const dialogRef = this.#dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Unsaved Changes',
          message: 'You have unsaved changes. Are you sure you want to cancel?',
          confirmText: 'Yes, Cancel',
          type: 'destructive',
        },
        width: '400px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.#dialogRef.close({ action: 'cancel' });
        }
      });
    } else {
      this.#dialogRef.close({ action: 'cancel' });
    }
  }
}
