import { Component } from '@angular/core';
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

  constructor(private auth: AuthService, private router: Router) {}

  async entrar() {
    await this.ejecutar(() => this.auth.login(this.email, this.password));
  }

  async registrar() {
    await this.ejecutar(() => this.auth.register(this.email, this.password));
  }

  private async ejecutar(accion: () => Promise<unknown>) {
    this.error = '';
    this.cargando = true;
    try {
      await accion();
      this.router.navigate(['/home']);
    } catch (e: any) {
      this.error = this.mensaje(e.code);
    } finally {
      this.cargando = false;
    }
  }

  private mensaje(code: string): string {
    switch (code) {
      case 'auth/invalid-credential': return 'Correo o contraseña incorrectos.';
      case 'auth/email-already-in-use': return 'Ese correo ya está registrado.';
      case 'auth/weak-password': return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-email': return 'El correo no es válido.';
      default: return 'Ocurrió un error, intenta de nuevo.';
    }
  }
}