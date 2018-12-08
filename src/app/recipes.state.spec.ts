import { RecipesService } from './recipes.service';
import { Store, NgxsModule } from '@ngxs/store';
import { TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';
import { SaveRecipe, RecipesState, ReloadRecipes, RemoveRecipe } from './recipes.state';

describe('Recipes store', () => {
  let store: Store;
  let recipesService: RecipesService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([RecipesState])],
      providers: [
        {
          provide: RecipesService,
          useValue: jasmine.createSpyObj({
            create: of(null),
            edit: of(null),
            remove: of(null),
            load: of([
              {
                id: 5,
                name: 'Tomato pizza',
                ingredients: []
              }
            ])
          })
        }
      ]
    }).compileComponents();
    store = TestBed.get(Store);
    recipesService = TestBed.get(RecipesService);
  }));

  it('should edit recipe when id is present on SaveRecipe', async(() => {
    store.dispatch(
      new SaveRecipe({
        id: 5,
        name: 'Tomato pizza',
        ingredients: []
      })
    );
    expect(recipesService.edit).toHaveBeenCalledWith({
      id: 5,
      name: 'Tomato pizza',
      ingredients: []
    });
    expect(recipesService.load).toHaveBeenCalled();
  }));

  it('should reload recipes', async(() => {
    store.dispatch(new ReloadRecipes());
    expect(recipesService.load).toHaveBeenCalled();
    store.selectOnce(recipes => {
      expect(recipes).toEqual([{
        id: 5,
        name: 'Tomato pizza',
        ingredients: []
      }]);
    });
  }));

  it('should create new recipe', async(() => {
    store.dispatch(new SaveRecipe({
      id: null,
      name: 'Tomato pizza',
      ingredients: []
    }));
    expect(recipesService.create).toHaveBeenCalledWith({
      id: null,
      name: 'Tomato pizza',
      ingredients: []
    });
    expect(recipesService.load).toHaveBeenCalled();
  }));

  it('should remove recipe', async(() => {
    store.dispatch(new RemoveRecipe({
      id: 5,
      name: 'Tomato pizza',
      ingredients: []
    }));
    expect(recipesService.remove).toHaveBeenCalledWith({
      id: 5,
      name: 'Tomato pizza',
      ingredients: []
    });
    expect(recipesService.load).toHaveBeenCalled();
  }));

  it('should remove recipe', async(() => {
    store.dispatch(new RemoveRecipe({
      id: 5,
      name: 'Tomato pizza',
      ingredients: []
    }));
    expect(recipesService.remove).toHaveBeenCalledWith({
      id: 5,
      name: 'Tomato pizza',
      ingredients: []
    });
    expect(recipesService.load).toHaveBeenCalled();
  }));
});
