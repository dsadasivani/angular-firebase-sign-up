import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseError } from 'firebase/app';
import { getFirebaseErrorMessage } from '../utilities/auth-errors';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  loading = signal(false);

  showLoading() {
    this.loading.set(true);
  }
  hideLoading() {
    this.loading.set(false);
  }

  snackbar = inject(MatSnackBar);
  success(message: string) {
    this.snackbar.open(message, undefined, {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
  error(message: string) {
    this.snackbar.open(message, 'close', {
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
  firebaseError(err: FirebaseError) {
    this.error(getFirebaseErrorMessage(err));
  }
}
