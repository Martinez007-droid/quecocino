import { Injectable } from '@angular/core';

export interface RecetaResumen {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

@Injectable({ providedIn: 'root' })
export class RecetasService {
  private base = 'https://www.themealdb.com/api/json/v1/1';

  async buscarPorIngrediente(ingrediente: string): Promise<RecetaResumen[]> {
    const q = ingrediente.trim().toLowerCase().replace(/\s+/g, '_');
    const res = await fetch(`${this.base}/filter.php?i=${encodeURIComponent(q)}`);
    if (!res.ok) {
      throw new Error('Error al consultar la API');
    }
    const data = await res.json();
    return data.meals ?? [];
  }
}