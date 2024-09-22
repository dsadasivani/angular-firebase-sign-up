import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordsDontMatch: true };
    } else {
      return null;
    }
  };
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="card mat-elevation-z5">
      <h1>Sign Up</h1>
      <form [formGroup]="signUpForm" (ngSubmit)="signUp()">
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          <mat-error *ngIf="name?.hasError('required')">
            Name is required
          </mat-error>
        </mat-form-field>
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
          <input matInput type="password" formControlName="password" />
          <mat-error *ngIf="password?.hasError('required')">
            Password is required
          </mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Confirm Password</mat-label>
          <input matInput type="password" formControlName="confirmPassword" />
          <mat-error *ngIf="confirmPassword?.hasError('required')">
            Confirm Password is required
          </mat-error>
        </mat-form-field>
        <mat-error *ngIf="signUpForm.hasError('passwordsDontMatch')">
          Passwords should match
        </mat-error>
        <div class="center margin-top">
          <button mat-raised-button color="primary">Sign Up</button>
        </div>
      </form>
    </div>
  `,
  styles: ``,
})
export class SignUpComponent {
  authService = inject(AuthService);
  userService = inject(UsersService);
  notifications = inject(NotificationService);
  router = inject(Router);
  fb = inject(FormBuilder);

  signUpForm = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatchValidator() }
  );

  name = this.signUpForm.get('name');
  email = this.signUpForm.get('email');
  password = this.signUpForm.get('password');
  confirmPassword = this.signUpForm.get('confirmPassword');

  async signUp() {
    const { name, email, password } = this.signUpForm.value;

    if (!this.signUpForm.valid || !name || !password || !email) {
      return;
    }
    try {
      this.notifications.showLoading();
      const {
        user: { uid },
      } = await this.authService.signUp(email, password);
      //  await this.auth.setDisplayName(user, name);
      await this.userService.addUser({ uid, email, displayName: name });
      this.notifications.success('User signup successful');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.log(error);
      this.notifications.firebaseError(error);
    } finally {
      this.notifications.hideLoading();
    }
  }
}
