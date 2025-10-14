import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '@core/models';
import { AuthService } from '@core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
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
    this.registerForm = this.#fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted.set(true);
    this.errorMessage.set('');

    if (this.registerForm.invalid) {
      return;
    }

    this.loading.set(true);
    const registerRequest: RegisterRequest = this.registerForm.value;

    const subscription = this.#authService.register(registerRequest).subscribe({
      next: () => {
        this.#router.navigate(['/login'], {
          queryParams: { message: 'Account created successfully. Please sign in.' },
        });
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Registration failed. Please try again.');
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
