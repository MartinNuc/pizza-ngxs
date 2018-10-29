import { Injectable } from '@angular/core';
import { Recipe } from './recipe';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private _recipes$ = new ReplaySubject<Recipe[]>(1);
  get recipes$() {
    return this._recipes$.asObservable();
  }

  constructor(public http: HttpClient) {}

  async reloadRecipes() {
    const recipes = await this.load().toPromise();
    this._recipes$.next(recipes);
  }

  load() {
    return this.http.get<Recipe[]>('/api/recipes');
  }

  saveRecipe(recipe: Recipe) {
    return recipe.id ? this.edit(recipe) : this.create(recipe);
  }

  create(recipe: Recipe) {
    return this.http.post('/api/recipes', recipe);
  }

  edit(recipe: Recipe) {
    return this.http.put(`/api/recipes/${recipe.id}`, recipe);
  }

  remove(recipe: Recipe) {
    return this.http.delete(`/api/recipes/${recipe.id}`);
  }
}
