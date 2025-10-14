import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '@core/models';
import { AuthService } from '@core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = signal<boolean>(false);
  submitted = signal<boolean>(false);
  errorMessage = signal<string>('');
  showPassword = signal<boolean>(false);

  #fb = inject(FormBuilder);
  #authService = inject(AuthService);
  #router = inject(Router);
  #subscriptions = new Set<Subscription>();

  ngOnInit() {
    this.#initializeForm();
  }

  #initializeForm() {
    this.loginForm = this.#fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted.set(true);
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    const loginRequest: LoginRequest = this.loginForm.value;

    const subscription = this.#authService.login(loginRequest).subscribe({
      next: (response) => {
        if (response.success) {
          this.#authService.setAuthState(response);
          this.#router.navigate(['/tasks']);
        } else {
          this.errorMessage.set(response.message || 'Login failed');
        }
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Login failed. Please try again.');
        this.loading.set(false);
      },
    });
    this.#subscriptions.add(subscription);
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  ngOnDestroy() {
    this.#subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.#subscriptions.clear();
  }
}
