import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonButton, IonSpinner, IonText, IonList, IonItem, IonLabel, IonNote
} from '@ionic/angular';
import { RecetasService, RecetaDetalle } from '../services/recetas.service';
import { FavoritosService } from '../services/favoritos.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonButton, IonSpinner, IonText, IonList, IonItem, IonLabel, IonNote
  ],
})
export class DetallePage implements OnInit {
  receta: RecetaDetalle | null = null;
  cargando = true;
  error = '';
  esFavorita = false;
  guardando = false;

  constructor(
    private route: ActivatedRoute,
    private recetasSrv: RecetasService,
    private favSrv: FavoritosService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'No se indicó la receta.';
      this.cargando = false;
      return;
    }

    try {
      this.receta = await this.recetasSrv.obtenerDetalle(id);
      this.cargando = false;
      this.cdr.detectChanges();

      if (this.receta) {
        try {
          this.esFavorita = await this.favSrv.esFavorita(id);
        } catch (e) {
          console.error('Error al consultar favoritas:', e);
        }
      } else {
        this.error = 'No se encontró la receta.';
      }
    } catch (e) {
      console.error('Error al cargar la receta:', e);
      this.error = 'No se pudo cargar la receta.';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  async alternarFavorita() {
    if (!this.receta) {
      return;
    }
    this.error = '';
    this.guardando = true;
    this.cdr.detectChanges();
    try {
      if (this.esFavorita) {
        await this.favSrv.quitar(this.receta.idMeal);
        this.esFavorita = false;
      } else {
        await this.favSrv.agregar({
          idMeal: this.receta.idMeal,
          strMeal: this.receta.strMeal,
          strMealThumb: this.receta.strMealThumb
        });
        this.esFavorita = true;
      }
    } catch (e) {
      console.error('Error al actualizar favoritas:', e);
      this.error = 'No se pudo actualizar tus favoritas.';
    } finally {
      this.guardando = false;
      this.cdr.detectChanges();
    }
  }
}