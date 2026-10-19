import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonButton, IonList, IonItem, IonThumbnail, IonLabel, IonSpinner, IonText
} from '@ionic/angular';
import { FavoritosService } from '../services/favoritos.service';
import { RecetaResumen } from '../services/recetas.service';

@Component({
  selector: 'app-favoritas',
  templateUrl: './favoritas.page.html',
  styleUrls: ['./favoritas.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonButton, IonList, IonItem, IonThumbnail, IonLabel, IonSpinner, IonText
  ],
})
export class FavoritasPage {
  favoritas: RecetaResumen[] = [];
  cargando = false;
  error = '';

  constructor(
    private favSrv: FavoritosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ionViewWillEnter() {
    await this.cargar();
  }

  async cargar() {
    this.error = '';
    this.cargando = true;
    this.cdr.detectChanges();
    try {
      this.favoritas = await this.favSrv.listar();
    } catch (e) {
      console.error('Error al cargar favoritas:', e);
      this.favoritas = [];
      this.error = 'No se pudieron cargar tus favoritas.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  abrir(id: string) {
    this.router.navigate(['/detalle', id]);
  }

  async quitar(r: RecetaResumen) {
    try {
      await this.favSrv.quitar(r.idMeal);
      this.favoritas = this.favoritas.filter(f => f.idMeal !== r.idMeal);
    } catch (e) {
      console.error('Error al quitar favorita:', e);
      this.error = 'No se pudo quitar la receta.';
    } finally {
      this.cdr.detectChanges();
    }
  }
}