import { Injectable } from '@angular/core';
import {
  collection, deleteDoc, doc, getDoc, getDocs,
  orderBy, query, serverTimestamp, setDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { AuthService } from './auth.service';
import { RecetaResumen } from './recetas.service';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  constructor(private auth: AuthService) {}

  private get uid(): string {
    const u = this.auth.user;
    if (!u) {
      throw new Error('Sin sesión');
    }
    return u.uid;
  }

  async agregar(r: RecetaResumen): Promise<void> {
    await setDoc(doc(db, 'usuarios', this.uid, 'favoritas', r.idMeal), {
      idMeal: r.idMeal,
      strMeal: r.strMeal,
      strMealThumb: r.strMealThumb,
      fecha: serverTimestamp()
    });
  }

  async quitar(idMeal: string): Promise<void> {
    await deleteDoc(doc(db, 'usuarios', this.uid, 'favoritas', idMeal));
  }

  async esFavorita(idMeal: string): Promise<boolean> {
    const snap = await getDoc(doc(db, 'usuarios', this.uid, 'favoritas', idMeal));
    return snap.exists();
  }

  async listar(): Promise<RecetaResumen[]> {
    const q = query(
      collection(db, 'usuarios', this.uid, 'favoritas'),
      orderBy('fecha', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as RecetaResumen);
  }
}