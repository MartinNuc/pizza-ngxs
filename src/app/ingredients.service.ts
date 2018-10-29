import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Ingredient } from './ingredient';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  private _ingredients$ = new ReplaySubject<Ingredient[]>(1);
  get ingredients$() {
    return this._ingredients$.asObservable();
  }

  constructor(public http: HttpClient) {}

  async reloadIngredients() {
    const ingredients = await this.load().toPromise();
    this._ingredients$.next(ingredients);
  }

  load() {
    return this.http.get<Ingredient[]>('/api/ingredients');
  }

  create(ingredient: Ingredient) {
    return this.http.post('/api/ingredients', ingredient);
  }

  edit(ingredient: Ingredient) {
    return this.http.put(`/api/ingredients/${ingredient.id}`, ingredient);
  }

  remove(ingredient: Ingredient) {
    return this.http.delete(`/api/ingredients/${ingredient.id}`);
  }
}
