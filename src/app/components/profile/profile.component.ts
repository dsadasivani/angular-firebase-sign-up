import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../../services/users.service';
import { NotificationService } from '../../services/notification.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  template: `
    <div class="card mat-elevation-z5 text-center">
      <h1>Update Profile</h1>
      <div class="profile-image">
        <img
          [src]="
            currentUser()?.photoURL ?? '/assets/images/image-placeholder.png'
          "
          width="120"
          height="120"
          class="margin-top mat-elevation-z1"
        />
        <button mat-mini-fab (click)="inputField.click()">
          <mat-icon>edit</mat-icon>
        </button>
      </div>
      <input #inputField type="file" (change)="uploadFile($event)" hidden />
      <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
        <div class="row">
          <mat-form-field>
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" />
          </mat-form-field>
        </div>
        <div class="row">
          <mat-form-field>
            <mat-label>Display Name</mat-label>
            <input matInput formControlName="displayName" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Phone</mat-label>
            <input type="number" matInput formControlName="phone" />
          </mat-form-field>
        </div>

        <mat-form-field>
          <mat-label>Address</mat-label>
          <input matInput formControlName="address" />
        </mat-form-field>
        <div class="center margin-top">
          <button mat-raised-button color="primary">Save</button>
        </div>
      </form>
    </div>
  `,
  styles: `
  .row {
    display: flex;
    gap:16px;
  }
  .profile-image {
    position: relative;
    width: 120px;
    margin: auto;
    > img {
      border-radius: 100%;
      object-fit: cover;
      object-position: center;
    }
    > button {
      position: absolute;
      bottom: 10px;
      right: 0;
    }
  }
  `,
})
export class ProfileComponent {
  fb = inject(NonNullableFormBuilder);
  userService = inject(UsersService);
  notificationService = inject(NotificationService);

  currentUser = this.userService.currentUserProfile;

  profileForm = this.fb.group({
    uid: [''],
    firstName: [''],
    lastName: [''],
    displayName: [''],
    phone: [''],
    address: [''],
  });

  constructor() {
    effect(() => {
      this.profileForm.patchValue({
        ...this.userService.currentUserProfile(),
      });
    });
  }

  firstName = this.profileForm.get('firstName');
  lastName = this.profileForm.get('lastName');
  diplayName = this.profileForm.get('displayName');
  phone = this.profileForm.get('phone');
  address = this.profileForm.get('address');

  async updateProfile() {
    const { uid, ...data } = this.profileForm.value;
    if (!uid) {
      return;
    }
    try {
      this.notificationService.showLoading();
      await this.userService.updateUser({ uid, ...data });
      this.notificationService.success('Profile updated successfully');
    } catch (error: any) {
      this.notificationService.firebaseError(error);
    } finally {
      this.notificationService.hideLoading();
    }
  }

  async uploadFile(event: any) {
    const file = event.target.files[0];
    const currentUserId = this.currentUser()?.uid;

    if (!file || !currentUserId) {
      return;
    }

    try {
      this.notificationService.showLoading();
      const photoURL = await this.userService.uploadProfilePhoto(
        file,
        `images/profile/${currentUserId}`
      );
      await this.userService.updateUser({ uid: currentUserId, photoURL });
      this.notificationService.success('Image uploaded successfully');
    } catch (error: any) {
      this.notificationService.firebaseError(error);
    } finally {
      this.notificationService.hideLoading();
    }
  }
}
