import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from './services/notification.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule,
  ],
  template: `
    <mat-toolbar color="primary">
      Firebase Sign-up App

      <button
        mat-button
        *ngIf="currentUser()"
        [mat-menu-trigger-for]="userMenu"
      >
        {{ currentUser()?.displayName }}
        <mat-icon>expand_more</mat-icon>
      </button>
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item routerLink="/profile">
          <mat-icon>person</mat-icon>
          Profile
        </button>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </mat-menu>
    </mat-toolbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
    <mat-progress-spinner *ngIf="loading()" mode="indeterminate" diameter="50">
    </mat-progress-spinner>
  `,
  styles: [
    `
      .container {
        padding: 24px;
      }
      mat-toolbar {
        justify-content: space-between;
      }
      mat-progress-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `,
  ],
})
export class AppComponent {
  router = inject(Router);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  userService = inject(UsersService);

  currentUser = this.userService.currentUserProfile;
  loading = this.notificationService.loading;

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
