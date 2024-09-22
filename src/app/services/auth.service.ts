import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { signInWithPopup } from 'firebase/auth';
import { ProfileUser } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);
  currentUser$ = authState(this.firebaseAuth);
  currentUser = toSignal(this.currentUser$);
  googleProvider = new GoogleAuthProvider();

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.firebaseAuth, email, password);
  }
  setDisplayName(user: User, name: string): Promise<void> {
    return updateProfile(user, { displayName: name });
  }

  logout(): Promise<void> {
    return signOut(this.firebaseAuth);
  }

  passwordReset(email: string): Promise<void> {
    return sendPasswordResetEmail(this.firebaseAuth, email);
  }

  async googleSignIn(): Promise<ProfileUser | null> {
    const userCreds = await signInWithPopup(
      this.firebaseAuth,
      this.googleProvider
    );
    const additionalnfo = getAdditionalUserInfo(userCreds);

    if (!additionalnfo?.isNewUser) {
      return Promise.resolve(null);
    }

    const {
      user: { uid, displayName, photoURL, email },
    } = userCreds;

    const newProfile = {
      displayName: displayName ?? '',
      uid,
      email: email ?? '',
      photoURL: photoURL ?? '',
    };

    return Promise.resolve(newProfile);
  }
}
