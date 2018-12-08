import { fakeAsync, tick } from '@angular/core/testing';

import { RecipeFormComponent } from './recipe-form.component';
import { Spectator, createTestComponentFactory } from '@netbasal/spectator';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { Ingredient } from '../ingredient';
import { RecipeFormIngredientComponent } from '../recipe-form-ingredient/recipe-form-ingredient.component';
import { SaveRecipe } from '../recipes.state';
import { ReloadIngredients } from '../ingredients.state';

describe('RecipeFormComponent', () => {
  let spectator: Spectator<RecipeFormComponent>;
  const createComponent = createTestComponentFactory({
    component: RecipeFormComponent,
    declarations: [RecipeFormIngredientComponent],
    imports: [ReactiveFormsModule],
    providers: [
      {
        provide: Store,
        useValue: jasmine.createSpyObj({
          dispatch: of(),
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

  beforeEach(() => (spectator = createComponent()));

  it('should clean form and dispatch event on submitting form', fakeAsync(() => {
    const store = spectator.get(Store);
    spectator.typeInElement(
      'tomato pizza',
      spectator.query('[data-test-recipe-form="name"]')
    );
    spectator.click(spectator.query('[data-test-recipe-form="addIngredient"]'));
    spectator.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(new ReloadIngredients());
    const ingredientSelect = spectator.query<HTMLSelectElement>(
      '[data-test-recipe-form-ingredient="ingredient"]'
    );
    ingredientSelect.value = '1: Object';
    ingredientSelect.dispatchEvent(new Event('change'));
    const ingredientCount = spectator.query<HTMLSelectElement>(
      '[data-test-recipe-form-ingredient="count"]'
    );
    spectator.typeInElement('5', ingredientCount);
    spectator.click(spectator.query('[data-test-recipe-form="save"]'));
    expect(store.dispatch).toHaveBeenCalledWith(
      new SaveRecipe({
        id: null,
        name: 'tomato pizza',
        ingredients: [
          {
            count: 5,
            ingredient: {
              id: 2,
              name: 'Tomato',
              price: 20
            }
          }
        ]
      })
    );
    spectator.detectChanges();
    tick();
    spectator.detectChanges();
    expect(spectator.query('[data-test-recipe-form="name"]').textContent).toBe(
      ''
    );
    expect(
      spectator.queryAll<RecipeFormIngredientComponent>(
        RecipeFormIngredientComponent
      ).length
    ).toBe(0);
  }));

  it('should update form when recipe input updates', () => {
    spectator.setInput('recipe', {
      id: 5,
      name: 'tomato pizza',
      ingredients: [
        {
          count: 3,
          ingredient: {
            id: 2,
            name: 'Tomato',
            price: 20
          }
        },
        {
          count: 2,
          ingredient: {
            id: 1,
            name: 'Garlic',
            price: 55
          }
        }
      ]
    });
    spectator.detectChanges();
    expect(
      spectator.query<HTMLInputElement>('[data-test-recipe-form="name"]').value
    ).toBe('tomato pizza');
    expect(
      spectator.queryAll('[data-test-recipe-form-ingredient="ingredient"]')
        .length
    ).toBe(2);
    expect(
      spectator.queryAll<HTMLInputElement[]>('[data-test-recipe-form-ingredient="count"]')[0].value
    ).toBe('3');
    expect(
      spectator.queryAll<HTMLInputElement[]>('[data-test-recipe-form-ingredient="count"]')[1].value
    ).toBe('2');
  });
});
