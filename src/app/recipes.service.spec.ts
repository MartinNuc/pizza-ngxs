import { RecipesService } from './recipes.service';
import { createHTTPFactory, HTTPMethod } from '@netbasal/spectator';

describe('RecipesService', () => {
  const http = createHTTPFactory<RecipesService>(RecipesService);

  it('should load recipes', () => {
    const { dataService, expectOne } = http();
    dataService.load().subscribe();
    expectOne('/api/recipes', HTTPMethod.GET);
  });

  it('should create new recipe', () => {
    const { dataService, expectOne } = http();
    dataService
      .create({
        id: null,
        ingredients: [
          { count: 1, ingredient: { id: 5, name: 'garlic', price: 5 } }
        ],
        name: 'tomato pizza'
      })
      .subscribe();
    const req = expectOne('/api/recipes', HTTPMethod.POST);
    expect(req.request.body.name).toBe('tomato pizza');
    expect(req.request.body.ingredients[0].count).toBe(1);
    expect(req.request.body.ingredients[0].ingredient.name).toBe('garlic');
  });

  it('should edit recipe', () => {
    const { dataService, expectOne } = http();
    dataService.edit({
      id: 5,
      name: 'tomato pizza',
      ingredients: []
    }).subscribe();
    const req = expectOne('/api/recipes/5', HTTPMethod.PUT);
    expect(req.request.body.name).toBe('tomato pizza');
  });

  it('should delete recipe', () => {
    const { dataService, expectOne } = http();
    dataService.remove({
      id: 5,
      ingredients: [],
      name: 'tomato pizza'
    }).subscribe();
    expectOne('/api/recipes/5', HTTPMethod.DELETE);
  });

  it('should use edit method when id preset on save recipe', () => {
    const { dataService } = http();
    spyOn(dataService, 'create');
    spyOn(dataService, 'edit');
    dataService.saveRecipe({
      id: 5,
      ingredients: [],
      name: 'tomato pizza'
    });
    expect(dataService.edit).toHaveBeenCalled();
    expect(dataService.create).not.toHaveBeenCalled();
  });

  it('should use create method when id is missing on save recipe', () => {
    const { dataService } = http();
    spyOn(dataService, 'create');
    spyOn(dataService, 'edit');
    dataService.saveRecipe({
      id: null,
      ingredients: [],
      name: 'tomato pizza'
    });
    expect(dataService.edit).not.toHaveBeenCalled();
    expect(dataService.create).toHaveBeenCalled();
  });
});
