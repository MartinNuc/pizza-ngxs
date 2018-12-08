import { PriceOfRecipePipe } from './price-of-recipe.pipe';

describe('PriceOfRecipePipe', () => {
  const pipe = new PriceOfRecipePipe();

  it('should sum empty array', () => {
    expect(pipe.transform([])).toBe(0);
  });

  it('should add prices in the array', () => {
    expect(
      pipe.transform([
        {
          count: 2,
          ingredient: {
            id: 1,
            name: '',
            price: 5
          }
        },
        {
          count: 1,
          ingredient: {
            id: 2,
            name: '',
            price: 33
          }
        }
      ])
    ).toBe(43);
  });
});
