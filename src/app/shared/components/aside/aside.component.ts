import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss',
})
export class AsideComponent {
  isOpen = signal<boolean>(false);
  authService = inject(AuthService);
  router = inject(Router);

  toggleAside() {
    this.isOpen.set(!this.isOpen());
  }

  closeAside() {
    this.isOpen.set(false);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.closeAside();
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  onLogout() {
    this.authService.logout();
    this.closeAside();
  }
}
