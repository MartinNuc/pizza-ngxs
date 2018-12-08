import {
  MockComponent,
  Spectator,
  createTestComponentFactory
} from '@netbasal/spectator';
import { NgxsModule, Store } from '@ngxs/store';
import { RemoveIngredient, EditIngredient } from '../ingredients.state';
import { IngredientsPageComponent } from './ingredients-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subject } from 'rxjs';
import { Ingredient } from '../ingredient';
import { TestBed } from '@angular/core/testing';

describe('NewIngredientPageComponent', () => {
  let spectator: Spectator<IngredientsPageComponent>;
  const createComponent = createTestComponentFactory({
    component: IngredientsPageComponent,
    declarations: [MockComponent({ selector: 'app-ingredient-form' })],
    imports: [HttpClientTestingModule, NgxsModule.forRoot()]
  });

  beforeEach(() => {
    spectator = createComponent({}, false);
    spectator.component.newIngredientForm = jasmine.createSpyObj(
      'newIngredientForm',
      ['reset', 'setValue']
    );
  });

  it('should display list of available ingredients', () => {
    spectator.detectChanges();
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

  it('should emit Edit action when edit button clicked', () => {
    spectator.detectChanges();
    spectator.component.ingredients$ = of<Ingredient[]>([
      {
        id: 1,
        name: 'Garlic',
        price: 123
      }
    ]);
    spectator.detectChanges();
    const store = spectator.get(Store);
    spyOn(store, 'dispatch');
    spectator.click('.edit');
    expect(store.dispatch).toHaveBeenCalledWith(
      new EditIngredient({
        id: 1,
        name: 'Garlic',
        price: 123
      })
    );
  });

  it('should fill form with on edit action', () => {
    const selectSubject = new Subject();
    const store = spectator.get(Store);
    spyOn(store, 'select').and.returnValue(selectSubject);
    spectator.component.ngOnInit();
    spectator.component.ingredients$ = of<Ingredient[]>([
      {
        id: 1,
        name: 'Garlic',
        price: 123
      }
    ]);
    spectator.detectChanges();

    selectSubject.next({
      id: 1,
      name: 'Garlic',
      price: 123
    });

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
    spectator.detectChanges();
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
