import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user: User | null = null;
  ready: Promise<void>;

  constructor() {
    this.ready = new Promise(resolve => {
      const espera = setTimeout(() => resolve(), 4000);
      onAuthStateChanged(
        auth,
        u => {
          this.user = u;
          clearTimeout(espera);
          resolve();
        },
        () => {
          clearTimeout(espera);
          resolve();
        }
      );
    });
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  logout() {
    return signOut(auth);
  }
}