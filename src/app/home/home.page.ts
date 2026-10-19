import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonInput, IonList, IonItem, IonThumbnail, IonLabel, IonSpinner, IonText
} from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { RecetasService, RecetaResumen } from '../services/recetas.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonInput, IonList, IonItem, IonThumbnail, IonLabel, IonSpinner, IonText,
    FormsModule
  ],
})
export class HomePage {
  ingrediente = '';
  recetas: RecetaResumen[] = [];
  cargando = false;
  buscado = false;
  error = '';

  constructor(
    private auth: AuthService,
    private recetasSrv: RecetasService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async buscar() {
    if (!this.ingrediente.trim()) {
      return;
    }
    this.error = '';
    this.cargando = true;
    this.cdr.detectChanges();
    try {
      this.recetas = await this.recetasSrv.buscarPorIngrediente(this.ingrediente);
      this.buscado = true;
    } catch (e) {
      console.error('Error al buscar recetas:', e);
      this.recetas = [];
      this.error = 'No se pudo consultar las recetas. Revisa tu conexión e intenta de nuevo.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  abrir(id: string) {
    this.router.navigate(['/detalle', id]);
  }

  irAFavoritas() {
    this.router.navigate(['/favoritas']);
  }

  async salir() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}