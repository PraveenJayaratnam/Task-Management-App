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
    return this.postEntity<LoginResponse>('auth/login', loginRequest);
  }

  setAuthState(loginResponse: LoginResponse) {
    if (loginResponse.success) {
      const newState: AuthState = {
        user: loginResponse.user,
        isAuthenticated: true,
      };

      this.#authState.set(newState);
      localStorage.setItem('user', JSON.stringify(loginResponse.user));
    }
  }

  #getStoredUser(): User | null {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  logout() {
    const newState: AuthState = {
      user: null,
      isAuthenticated: false,
    };

    this.#authState.set(newState);
    localStorage.removeItem('user');
    this.#router.navigate(['/login']);
  }

  register(registerRequest: RegisterRequest) {
    return this.postEntity<User>('auth/register', registerRequest);
  }

  checkUsernameExists(username: string) {
    return this.getEntity<{ exists: boolean; username: string }>(
      `auth/check-username?username=${encodeURIComponent(username)}`
    );
  }

  clearAuthState() {
    const newState: AuthState = {
      user: null,
      isAuthenticated: false,
    };
    this.#authState.set(newState);
    localStorage.removeItem('user');
  }
}
