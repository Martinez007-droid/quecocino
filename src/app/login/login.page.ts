import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonInput, IonButton, IonText
} from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonText, FormsModule],
})
export class LoginPage {
  email = '';
  password = '';
  error = '';
  cargando = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async entrar() {
    await this.ejecutar(() => this.auth.login(this.email, this.password));
  }

  async registrar() {
    await this.ejecutar(() => this.auth.register(this.email, this.password));
  }

  private conTiempo<T>(promesa: Promise<T>, ms = 10000): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('tiempo agotado')), ms);
      promesa.then(
        v => { clearTimeout(t); resolve(v); },
        e => { clearTimeout(t); reject(e); }
      );
    });
  }

  private async ejecutar(accion: () => Promise<unknown>) {
    this.error = '';
    this.cargando = true;
    this.cdr.detectChanges();
    try {
      await this.conTiempo(accion());
      this.router.navigate(['/home']);
    } catch (e: any) {
      console.error('Error de autenticación:', e);
      this.error = e?.message === 'tiempo agotado'
        ? 'El servidor no respondió. Revisa tu conexión e intenta de nuevo.'
        : this.mensaje(e?.code);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  private mensaje(code: string): string {
    switch (code) {
      case 'auth/invalid-credential': return 'Correo o contraseña incorrectos.';
      case 'auth/email-already-in-use': return 'Ese correo ya está registrado.';
      case 'auth/weak-password': return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-email': return 'El correo no es válido.';
      case 'auth/network-request-failed': return 'Sin conexión. Revisa tu internet.';
      case 'auth/too-many-requests': return 'Demasiados intentos. Espera un momento e intenta de nuevo.';
      default: return 'Ocurrió un error, intenta de nuevo.';
    }
  }
}