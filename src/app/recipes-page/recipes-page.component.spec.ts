import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesPageComponent } from './recipes-page.component';
import { Spectator, createTestComponentFactory, MockComponent } from '@netbasal/spectator';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import { Recipe } from '../models/recipe';
import { PriceOfRecipePipe } from '../pipes/price-of-recipe.pipe';

describe('RecipesPageComponent', () => {
  let spectator: Spectator<RecipesPageComponent>;
  const createComponent = createTestComponentFactory({
    component: RecipesPageComponent,
    declarations: [MockComponent({ selector: 'app-recipe-form', inputs: ['recipe']}), PriceOfRecipePipe],
    imports: [HttpClientTestingModule, NgxsModule.forRoot()]
  });

  beforeEach(() => (spectator = createComponent()));

  it('should display recipes', () => {
    spectator.component.recipes$ = of<Recipe[]>([
      {
        id: 1,
        name: 'Tomato pizza',
        ingredients: [
          {
            count: 2,
            ingredient: {
              id: 1,
              name: 'tomato',
              price: 55
            }
          }
        ]
      }
    ]);
    spectator.detectChanges();
    expect(spectator.queryAll('li').length).toBe(1);
    const second = spectator.queryAll('li')[0];
    expect(second.textContent).toContain('Tomato pizza');
    expect(second.textContent).toContain('total price: 110');
  });
});
