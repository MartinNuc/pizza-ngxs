import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngredientsService } from '../services/ingredients.service';
import { Ingredient } from '../models/ingredient';
import { Store, Select, Actions, ofActionErrored } from '@ngxs/store';
import { ReloadIngredients, SaveIngredient, RemoveIngredient, IngredientsState, EditIngredient } from '../store/ingredients.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ingredients-page',
  templateUrl: './ingredients-page.component.html',
  styleUrls: ['./ingredients-page.component.scss']
})
export class IngredientsPageComponent implements OnInit {

  ingredients$: Observable<Ingredient[]>;
  edittedIngredient$: Observable<Ingredient>;
  error$: Observable<Error>;

  constructor(public store: Store, public actions$: Actions) {}

  ngOnInit() {
    this.ingredients$ = this.store.select<Ingredient[]>(state => state.ingredients.ingredients);
    this.edittedIngredient$ = this.store.select<Ingredient | null>(state => state.ingredients.edittedIngredient);
    this.error$ = this.store.select<Error>(state => state.ingredients.error);
    this.store.dispatch(new ReloadIngredients());
  }

  edit(ingredient: Ingredient) {
    this.store.dispatch(new EditIngredient(ingredient));
  }

  async save(ingredient: Ingredient) {
    await this.store.dispatch(new EditIngredient(ingredient)).toPromise();
    this.store.dispatch(new SaveIngredient(ingredient));
  }

  remove(ingredient: Ingredient) {
    this.store.dispatch(new RemoveIngredient(ingredient));
  }
}
