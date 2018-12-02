import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Ingredient } from './ingredient';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  constructor(public http: HttpClient) {}

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
