import { PriceOfRecipePipe } from './price-of-recipe.pipe';

describe('PriceOfRecipePipe', () => {
  it('create an instance', () => {
    const pipe = new PriceOfRecipePipe();
    expect(pipe).toBeTruthy();
  });
});
