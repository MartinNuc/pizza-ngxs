import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngredientsService } from '../ingredients.service';
import { Ingredient } from '../ingredient';
import { Store, Select } from '@ngxs/store';
import { ReloadIngredients, SaveIngredient, RemoveIngredient, IngredientsState } from '../ingredients.state';
import { Observable } from 'rxjs';
import { IngredientFormComponent } from '../ingredient-form/ingredient-form.component';

@Component({
  selector: 'app-ingredients-page',
  templateUrl: './ingredients-page.component.html',
  styleUrls: ['./ingredients-page.component.scss']
})
export class IngredientsPageComponent implements OnInit {

  @ViewChild(IngredientFormComponent)
  newIngredientForm: IngredientFormComponent;

  ingredients$: Observable<Ingredient[]>;

  edittedIngredient: Ingredient;

  constructor(public store: Store) {}

  ngOnInit() {
    this.ingredients$ = this.store.select(state => state.ingredients.ingredients);
    this.store.dispatch(new ReloadIngredients());
  }

  edit(ingredient: Ingredient) {
    this.newIngredientForm.reset();
    this.newIngredientForm.setValue(ingredient);
  }

  async save(ingredient: Ingredient) {
    await this.store.dispatch(new SaveIngredient(ingredient)).toPromise();
    this.newIngredientForm.reset();
  }

  remove(ingredient: Ingredient) {
    this.store.dispatch(new RemoveIngredient(ingredient));
  }
}
