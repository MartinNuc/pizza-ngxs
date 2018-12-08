import { Component, OnInit, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators
} from '@angular/forms';
import { Recipe } from '../recipe';
import { SaveRecipe } from '../recipes.state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent implements OnInit {

  @Input()
  set recipe(value: Recipe) {
    if (value && value.ingredients) {
      value.ingredients.forEach(i => this.addIngredient());
    }
    if (this.recipeForm) {
      this.recipeForm.patchValue(value || {});
    }
  }

  recipeForm: FormGroup;

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  constructor(public store: Store, public fb: FormBuilder) {}

  ngOnInit() {
    this.recipeForm = this.fb.group({
      id: [],
      name: ['', [Validators.required]],
      ingredients: this.fb.array([])
    });
  }

  addIngredient() {
    this.ingredients.push(this.fb.control({}, [Validators.required]));
  }

  async saveRecipe() {
    await this.store.dispatch(new SaveRecipe(this.recipeForm.value)).toPromise();
    this.recipeForm.reset();

    // NOTE: ugly! but recipeForm.reset() just resets values but doesnt remove controls
    while (this.ingredients.length) {
      this.ingredients.removeAt(0);
    }
  }
}
