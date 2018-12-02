import {
  MockComponent,
  Spectator,
  createTestComponentFactory
} from '@netbasal/spectator';
import { NgxsModule, Store } from '@ngxs/store';
import { RemoveIngredient } from '../ingredients.state';
import { IngredientsPageComponent } from './ingredients-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Ingredient } from '../ingredient';
import { TestBed } from '@angular/core/testing';

describe('NewIngredientPageComponent', () => {
  let spectator: Spectator<IngredientsPageComponent>;
  const createComponent = createTestComponentFactory({
    component: IngredientsPageComponent,
    declarations: [MockComponent({ selector: 'app-ingredient-form' })],
    imports: [HttpClientTestingModule, NgxsModule.forRoot()]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should display list of available ingredients', () => {
    spectator.component.ingredients$ = of<Ingredient[]>([
      {
        id: 1,
        name: 'Garlic',
        price: 123
      },
      {
        id: 2,
        name: 'Tomato',
        price: 11
      }
    ]);
    spectator.detectChanges();
    expect(spectator.queryAll('li').length).toBe(2);
    const second = spectator.queryAll('li')[1];
    expect(second.textContent).toContain('Tomato for 11');
  });

  it('should fill form with on edit', () => {
    spectator.component.ingredients$ = of<Ingredient[]>([
      {
        id: 1,
        name: 'Garlic',
        price: 123
      }
    ]);
    spectator.component.newIngredientForm = jasmine.createSpyObj(
      'newIngredientForm',
      ['reset', 'setValue']
    );
    spectator.detectChanges();
    spectator.click('.edit');
    expect(spectator.component.newIngredientForm.reset).toHaveBeenCalled();
    expect(spectator.component.newIngredientForm.setValue).toHaveBeenCalledWith(
      {
        id: 1,
        name: 'Garlic',
        price: 123
      }
    );
  });

  it('should trigger removal of ingredient', () => {
    spectator.component.ingredients$ = of<Ingredient[]>([
      {
        id: 1,
        name: 'Garlic',
        price: 123
      }
    ]);
    const store = TestBed.get(Store) as Store;
    spyOn(store, 'dispatch');
    spectator.detectChanges();
    spectator.click('.remove');
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      new RemoveIngredient({
        id: 1,
        name: 'Garlic',
        price: 123
      })
    );
  });
});
