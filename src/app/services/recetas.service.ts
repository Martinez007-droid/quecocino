import { Injectable } from '@angular/core';

export interface RecetaResumen {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface Ingrediente {
  nombre: string;
  medida: string;
}

export interface RecetaDetalle {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  ingredientes: Ingrediente[];
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

  async obtenerDetalle(id: string): Promise<RecetaDetalle | null> {
    const res = await fetch(`${this.base}/lookup.php?i=${encodeURIComponent(id)}`);
    if (!res.ok) {
      throw new Error('Error al consultar la API');
    }
    const data = await res.json();
    const m = data.meals?.[0];
    if (!m) {
      return null;
    }

    const ingredientes: Ingrediente[] = [];
    for (let i = 1; i <= 20; i++) {
      const nombre = (m[`strIngredient${i}`] ?? '').trim();
      if (nombre) {
        ingredientes.push({ nombre, medida: (m[`strMeasure${i}`] ?? '').trim() });
      }
    }

    return {
      idMeal: m.idMeal,
      strMeal: m.strMeal,
      strMealThumb: m.strMealThumb,
      strCategory: m.strCategory,
      strArea: m.strArea,
      strInstructions: m.strInstructions,
      ingredientes
    };
  }
}