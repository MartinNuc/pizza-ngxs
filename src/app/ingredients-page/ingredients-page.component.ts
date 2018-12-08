import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngredientsService } from '../services/ingredients.service';
import { Ingredient } from '../models/ingredient';
import { Store, Select } from '@ngxs/store';
import { ReloadIngredients, SaveIngredient, RemoveIngredient, IngredientsState, EditIngredient } from '../store/ingredients.state';
import { Observable } from 'rxjs';
import { IngredientFormComponent } from '../ingredient-form/ingredient-form.component';

@Component({
  selector: 'app-ingredients-page',
  templateUrl: './ingredients-page.component.html',
  styleUrls: ['./ingredients-page.component.scss']
})
export class IngredientsPageComponent implements OnInit, AfterViewInit {

  @ViewChild(IngredientFormComponent)
  newIngredientForm: IngredientFormComponent;

  ingredients$: Observable<Ingredient[]>;

  constructor(public store: Store) {}

  ngOnInit() {
    this.ingredients$ = this.store.select<Ingredient[]>(state => state.ingredients.ingredients);
    this.store.dispatch(new ReloadIngredients());
  }

  ngAfterViewInit() {
    this.store.select<Ingredient | null>(state => state.ingredients.edittedIngredient).subscribe(edittedIngredient => {
      this.newIngredientForm.reset();
      if (edittedIngredient) {
        this.newIngredientForm.setValue(edittedIngredient);
      }
    });
  }

  edit(ingredient: Ingredient) {
    this.store.dispatch(new EditIngredient(ingredient));
  }

  async save(ingredient: Ingredient) {
    await this.store.dispatch(new SaveIngredient(ingredient)).toPromise();
    this.newIngredientForm.reset();
  }

  remove(ingredient: Ingredient) {
    this.store.dispatch(new RemoveIngredient(ingredient));
  }
}
