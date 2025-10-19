import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@core/components';
import { authGuard } from '@core/guards';
import { TaskManagementComponent } from '@features/task-management/components';
import {
  LoginComponent,
  RegisterComponent,
  UserManagementComponent,
} from '@features/user-management/components';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - Task Management',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register - Task Management',
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'tasks',
        component: TaskManagementComponent,
        title: 'Tasks - Task Management',
      },
      {
        path: 'users',
        component: UserManagementComponent,
        title: 'User Management - Task Management',
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
