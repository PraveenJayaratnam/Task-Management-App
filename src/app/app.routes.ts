import { Routes } from '@angular/router';
import { authGuard } from '@core/guards';
import { TaskManagementComponent } from '@features/task-management/components';
import { LoginComponent, RegisterComponent } from '@features/user-management/components';

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
    path: 'tasks',
    component: TaskManagementComponent,
    canActivate: [authGuard],
    title: 'Tasks - Task Management',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
