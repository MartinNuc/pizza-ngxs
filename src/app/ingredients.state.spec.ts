import { async, TestBed } from '@angular/core/testing';
import { Store, NgxsModule } from '@ngxs/store';
import {
  IngredientsState,
  SaveIngredient,
  EditIngredient
} from './ingredients.state';
import { IngredientsService } from './ingredients.service';
import { of } from 'rxjs';
import { Spied } from 'src/test';

describe('Ingredients store', () => {
  let store: Store;
  let ingredientsService: Spied<IngredientsService>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([IngredientsState])],
      providers: [
        {
          provide: IngredientsService,
          useValue: jasmine.createSpyObj({
            create: of(null),
            edit: of(null),
            remove: of(null),
            load: of([])
          })
        }
      ]
    }).compileComponents();
    store = TestBed.get(Store);
    ingredientsService = TestBed.get(IngredientsService);
  }));

  it('should edit ingredient when id is present on SaveIngredient', async(() => {
    store.dispatch(
      new SaveIngredient({
        id: 5,
        name: 'Garlic',
        price: 123
      })
    );
    expect(ingredientsService.edit).toHaveBeenCalledWith({
      id: 5,
      name: 'Garlic',
      price: 123
    });
  }));

  it('should create ingredient when id is missing on SaveIngredient', async(() => {
    store.dispatch(
      new SaveIngredient({
        id: null,
        name: 'Garlic',
        price: 123
      })
    );
    expect(ingredientsService.create).toHaveBeenCalledWith({
      id: null,
      name: 'Garlic',
      price: 123
    });
  }));

  it('should reload ingredients after editing one', () => {
    ingredientsService.edit.and.returnValue(of(null));
    ingredientsService.load.and.returnValue(
      of([
        {
          id: 1,
          name: 'Garlic',
          price: 123
        }
      ])
    );
    store.dispatch(
      new EditIngredient({
        id: null,
        name: 'Garlic',
        price: 123
      })
    );
    expect(ingredientsService.edit).toHaveBeenCalled();
    expect(ingredientsService.load).toHaveBeenCalled();
    store
      .selectOnce(state => state.ingredients.ingredients)
      .subscribe(ingredients => expect(ingredients.length).toBe(1));
  });
});
