import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@core/models';
import { AuthService, UserService } from '@core/services';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Subscription } from 'rxjs';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users = signal<User[]>([]);
  loading = signal<boolean>(false);
  message = signal<string>('');
  messageType = signal<'success' | 'error' | 'info'>('info');

  authService = inject(AuthService);
  userService = inject(UserService);
  dialog = inject(MatDialog);
  #subscriptions = new Set<Subscription>();

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    const subscription = this.userService.getUsers().subscribe({
      next: (response) => {
        const users = response.map((user) => this.userService.mapToUser(user));
        this.users.set(users);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        const errorMessage = this.getErrorMessage(error);
        this.showMessage(errorMessage || 'Failed to load users', 'error');
        this.loading.set(false);
      },
    });
    this.#subscriptions.add(subscription);
  }

  onDeleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
      },
    });

    const dialogSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const subscription = this.userService.deleteUser(user.id!).subscribe({
          next: () => {
            this.users.update((users) => users.filter((u) => u.id !== user.id));
            this.showMessage('User deleted successfully', 'success');
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            const errorMessage = this.getErrorMessage(error);
            this.showMessage(errorMessage || 'Failed to delete user', 'error');
          },
        });
        this.#subscriptions.add(subscription);
      }
    });
    this.#subscriptions.add(dialogSubscription);
  }

  onEditUser(user: User) {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '500px',
      data: {
        user: user,
      },
    });

    const dialogSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === 'update') {
        const updateDto = this.userService.mapToUpdateDto(result.user);

        const subscription = this.userService.updateUser(user.id!, updateDto).subscribe({
          next: () => {
            this.showMessage(
              `User ${user.firstName} ${user.lastName} updated successfully`,
              'success'
            );

            const currentUser = this.authService.user;
            if (currentUser && currentUser.id === user.id) {
              const getUserSubscription = this.userService
                .getUserById(user.id!)
                .subscribe({
                  next: (updatedUser) => {
                    const mappedUser = this.userService.mapToUser(updatedUser);
                    if (!mappedUser.isActive) {
                      this.showMessage(
                        'Your account has been deactivated. You will be logged out.',
                        'info'
                      );
                      this.authService.logout();
                    } else {
                      this.loadUsers();
                    }
                  },
                  error: (error) => {
                    console.error('Error fetching updated user:', error);
                    this.loadUsers();
                  },
                });
              this.#subscriptions.add(getUserSubscription);
            } else {
              this.loadUsers();
            }
          },
          error: (error) => {
            console.error('Error updating user:', error);
            const errorMessage = this.getErrorMessage(error);
            this.showMessage(errorMessage || 'Failed to update user', 'error');
          },
        });
        this.#subscriptions.add(subscription);
      }
    });
    this.#subscriptions.add(dialogSubscription);
  }

  showMessage(text: string, type: 'success' | 'error' | 'info') {
    this.message.set(text);
    this.messageType.set(type);

    if (type === 'success') {
      setTimeout(() => this.clearMessage(), 3000);
    }
  }

  clearMessage() {
    this.message.set('');
  }

  private getErrorMessage(error: unknown): string | null {
    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>;

      if (errorObj['error'] && typeof errorObj['error'] === 'object') {
        const nestedError = errorObj['error'] as Record<string, unknown>;
        if (typeof nestedError['message'] === 'string') {
          return nestedError['message'];
        }
        if (typeof nestedError['Message'] === 'string') {
          return nestedError['Message'];
        }
      }

      if (typeof errorObj['message'] === 'string') {
        return errorObj['message'];
      }
    }

    if (typeof error === 'string') {
      return error;
    }

    return null;
  }

  onRefresh() {
    this.loadUsers();
  }

  ngOnDestroy() {
    this.#subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.#subscriptions.clear();
  }
}
