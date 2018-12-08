import { RecipeFormIngredientComponent } from './recipe-form-ingredient.component';
import {
  SpectatorWithHost,
  createHostComponentFactory
} from '@netbasal/spectator';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { Ingredient } from '../models/ingredient';
import { ReloadIngredients } from '../store/ingredients.state';

@Component({ selector: 'app-custom-host', template: '' })
class CustomHostComponent {
  recipeForm = this.fb.group({
    ingredient: []
  });
  constructor(public fb: FormBuilder) {}
  saveRecipe = jasmine.createSpy();
}

describe('RecipeFormIngredientComponent', () => {
  let host: SpectatorWithHost<
    RecipeFormIngredientComponent,
    CustomHostComponent
  >;
  const createHost = createHostComponentFactory({
    component: RecipeFormIngredientComponent,
    host: CustomHostComponent,
    imports: [ReactiveFormsModule],
    providers: [
      {
        provide: Store,
        useValue: jasmine.createSpyObj({
          dispatch: jasmine.createSpy(),
          select: of<Ingredient[]>([
            {
              id: 1,
              name: 'Garlic',
              price: 55
            },
            {
              id: 2,
              name: 'Tomato',
              price: 20
            }
          ])
        })
      }
    ]
  });

  it('should be usable inside of the form', () => {
    host = createHost(`
      <form [formGroup]="recipeForm">
        <app-recipe-form-ingredient formControlName="ingredient"></app-recipe-form-ingredient>
      </form>
    `);
    const store = host.get(Store);
    expect(store.dispatch).toHaveBeenCalledWith(new ReloadIngredients());
    host.detectChanges();
    expect(host.hostComponent.recipeForm.invalid).toBe(true);
    const ingredientCount = host.query<HTMLSelectElement>(
      '[data-test-recipe-form-ingredient="count"]'
    );
    host.typeInElement('5', ingredientCount);
    const ingredientSelect = host.query<HTMLSelectElement>(
      '[data-test-recipe-form-ingredient="ingredient"]'
    );
    expect(ingredientSelect.length).toBe(2);
    host.detectChanges();
    ingredientSelect.value = '1: Object';
    ingredientSelect.dispatchEvent(new Event('change'));
    host.detectChanges();
    expect(host.hostComponent.recipeForm.invalid).toBe(false);
    expect(host.hostComponent.recipeForm.value).toEqual({
      ingredient: {
        count: 5,
        ingredient: {
          id: 2,
          name: 'Tomato',
          price: 20
        }
      }
    });
  });
});
