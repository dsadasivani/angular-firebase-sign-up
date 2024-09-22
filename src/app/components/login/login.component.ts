import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { UsersService } from '../../services/users.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  template: `
    <div class="card mat-elevation-z5">
      <h1>Login</h1>
      <div class="center">
        <img
          src="/assets/images/google-sign-in.png"
          class="social-sign-in"
          role="button"
          width="70%"
          (click)="googleSignIn()"
        />
      </div>
      <div class="seperator">-- OR --</div>
      <form [formGroup]="loginForm" (ngSubmit)="login()">
        <mat-form-field>
          <mat-label>Email Address</mat-label>
          <input matInput formControlName="email" />
          <mat-error *ngIf="email?.hasError('required')">
            Email address is required
          </mat-error>
          <mat-error *ngIf="email?.hasError('email')">
            Email address is not valid
          </mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Password</mat-label>
          <input type="password" matInput formControlName="password" />
          <mat-error *ngIf="password?.hasError('required')">
            Password is required
          </mat-error>
        </mat-form-field>
        <div class="center margin-top">
          <button type="submit" mat-raised-button color="primary">Login</button>
        </div>
        <div class="login-footer">
          <a class="sign-up" routerLink="/sign-up">Create Account</a>
          <a (click)="forgotPassword()">Forgot Password?</a>
        </div>
      </form>
    </div>
  `,
  styles: `
  .login-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 3vh;

    .sign-up {
      // font-size: 1rem;

    }
  }
  .seperator {
      margin-top: 16px;
      margin-bottom: 16px;
      text-align: center;
  }
  .social-sign-in {
    cursor: pointer;
  }
  a {
    cursor: pointer;
    text-decoration: underline;
    color: darkblue;
  }

  `,
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  notificationService = inject(NotificationService);
  userService = inject(UsersService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  email = this.loginForm.get('email');
  password = this.loginForm.get('password');

  async login() {
    const { email, password } = this.loginForm.value;
    if (!this.loginForm.valid || !email || !password) {
      return;
    }
    try {
      this.notificationService.showLoading();
      await this.authService.login(email, password);
      this.notificationService.success('Logged in successfully');
      this.router.navigate(['home']);
    } catch (error: any) {
      this.notificationService.firebaseError(error);
    } finally {
      this.notificationService.hideLoading();
    }
  }

  async forgotPassword() {
    const { email } = this.loginForm.value;
    if (!email) {
      this.notificationService.error('Please enter valid email address.');
      return;
    }
    try {
      this.notificationService.showLoading();
      await this.authService.passwordReset(email);
      this.notificationService.success(
        'Password reset email has been sent. Please check the your inbox'
      );
    } catch (error: any) {
      this.notificationService.firebaseError(error);
    } finally {
      this.notificationService.hideLoading();
    }
  }

  async googleSignIn() {
    try {
      this.notificationService.showLoading();
      const newUser = await this.authService.googleSignIn();
      if (newUser) {
        this.userService.addUser(newUser);
      }
      this.router.navigate(['/home']);
      this.notificationService.success('Logged in successfully');
    } catch (error: any) {
      this.notificationService.firebaseError(error);
    } finally {
      this.notificationService.hideLoading();
    }
  }
}
