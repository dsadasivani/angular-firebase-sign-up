import { FirebaseError } from 'firebase/app';

export const getFirebaseErrorMessage = ({ code }: FirebaseError): string => {
  let message;

  switch (code) {
    case 'auth/invalid-credential':
      message = 'Invalid user/Incorrect password';
      break;
    case 'auth/weak-password':
      message = 'Password should be at least 6 characters';
      break;
    case 'auth/email-already-in-use':
      message = 'User with this email already exists';
      break;
    default:
      message = 'Unspecified error occurred. Please contact administrator';
  }

  return message;
};
