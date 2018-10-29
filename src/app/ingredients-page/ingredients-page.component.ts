import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngredientsService } from '../ingredients.service';
import { Ingredient } from '../ingredient';
import { Store, Select } from '@ngxs/store';
import { ReloadIngredients, SaveIngredient, RemoveIngredient, IngredientsState } from '../ingredients.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ingredients-page',
  templateUrl: './ingredients-page.component.html',
  styleUrls: ['./ingredients-page.component.scss']
})
export class IngredientsPageComponent implements OnInit {
  @ViewChild('firstName') firstNameElement: ElementRef;

  newIngredientForm: FormGroup;

  @Select(IngredientsState.ingredients)
  ingredients$: Observable<Ingredient[]>;

  edittedIngredient: Ingredient;

  constructor(public store: Store, public fb: FormBuilder) {}

  buildForm() {
    this.newIngredientForm = this.fb.group({
      id: [],
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.buildForm();
    this.store.dispatch(new ReloadIngredients());
  }

  async save() {
    const ingredient = this.newIngredientForm.value;
    await this.store.dispatch(new SaveIngredient(ingredient)).toPromise();
    this.newIngredientForm.reset();
  }

  edit(ingredient: Ingredient) {
    this.newIngredientForm.reset();
    this.newIngredientForm.setValue(ingredient);
  }

  remove(ingredient: Ingredient) {
    this.store.dispatch(new RemoveIngredient(ingredient));
  }
}
