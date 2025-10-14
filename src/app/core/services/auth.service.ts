import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BaseApiService } from '@shared/services';
import { AuthState, LoginRequest, LoginResponse, RegisterRequest, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseApiService {
  #authState = signal<AuthState>({
    user: this.#getStoredUser(),
    isAuthenticated: !!this.#getStoredUser(),
  });

  #router = inject(Router);

  get user() {
    return this.#authState().user;
  }

  get isAuthenticated() {
    return this.#authState().isAuthenticated;
  }

  login(loginRequest: LoginRequest) {
    return this.post<LoginResponse>('auth/login', loginRequest);
  }

  setAuthState(loginResponse: LoginResponse) {
    if (loginResponse.success) {
      const newState: AuthState = {
        user: loginResponse.user,
        isAuthenticated: true,
      };

      this.#authState.set(newState);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('user', JSON.stringify(loginResponse.user));
      }
    }
  }

  #getStoredUser(): User | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  logout() {
    const newState: AuthState = {
      user: null,
      isAuthenticated: false,
    };

    this.#authState.set(newState);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user');
    }
    this.#router.navigate(['/login']);
  }

  register(registerRequest: RegisterRequest) {
    return this.post<User>('auth/register', registerRequest);
  }

  clearAuthState() {
    const newState: AuthState = {
      user: null,
      isAuthenticated: false,
    };
    this.#authState.set(newState);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user');
    }
  }
}
