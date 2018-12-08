import { TestBed } from '@angular/core/testing';

import { IngredientsService } from './ingredients.service';
import { createHTTPFactory, HTTPMethod } from '@netbasal/spectator';

describe('IngredientsService', () => {
  const http = createHTTPFactory<IngredientsService>(IngredientsService);

  it('should load ingredients', () => {
    const { dataService, expectOne } = http();
​
    dataService.load().subscribe();
    expectOne('/api/ingredients', HTTPMethod.GET);
  });

  it('should create ingredient', () => {
    const { dataService, expectOne } = http();
​
    dataService.create({
      id: null,
      name: 'Garlic',
      price: 123
    }).subscribe();
    const req = expectOne('/api/ingredients', HTTPMethod.POST);
    expect(req.request.body.name).toBe('Garlic');
    expect(req.request.body.price).toBe(123);
  });

  it('should edit ingredient', () => {
    const { dataService, expectOne } = http();
​
    dataService.edit({
      id: 5,
      name: 'Garlic',
      price: 123
    }).subscribe();
    const req = expectOne('/api/ingredients/5', HTTPMethod.PUT);
    expect(req.request.body.id).toBe(5);
    expect(req.request.body.name).toBe('Garlic');
    expect(req.request.body.price).toBe(123);
  });

  it('should remove ingredient', () => {
    const { dataService, expectOne } = http();
​
    dataService.remove({
      id: 5,
      name: 'Garlic',
      price: 123
    }).subscribe();
    expectOne('/api/ingredients/5', HTTPMethod.DELETE);
  });
});
