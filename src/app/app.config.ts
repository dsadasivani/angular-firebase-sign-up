import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyACG2IilhwPBMAd3yTkmSkqMbfkF8siW1I',
  authDomain: 'angular-firebase-sign-up.firebaseapp.com',
  projectId: 'angular-firebase-sign-up',
  storageBucket: 'angular-firebase-sign-up.appspot.com',
  messagingSenderId: '1048083197503',
  appId: '1:1048083197503:web:84c6160a6f1c26759e128a',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    MatSnackBarModule,
  ],
};
