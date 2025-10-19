import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@core/components';
import { authGuard } from '@core/guards';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@features/user-management/components').then((m) => m.LoginComponent),
    title: 'Login - Task Management',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@features/user-management/components').then((m) => m.RegisterComponent),
    title: 'Register - Task Management',
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'tasks',
        loadComponent: () =>
          import('@features/task-management/components').then(
            (m) => m.TaskManagementComponent
          ),
        title: 'Tasks - Task Management',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('@features/user-management/components').then(
            (m) => m.UserManagementComponent
          ),
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
