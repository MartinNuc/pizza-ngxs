import { Pipe, PipeTransform } from '@angular/core';
import { IngredientInRecipe } from './recipe';

@Pipe({
  name: 'priceOfRecipe'
})
export class PriceOfRecipePipe implements PipeTransform {

  transform(ingredients: IngredientInRecipe[], args?: any): any {
    return ingredients.reduce((acc, curr) => curr.count * curr.ingredient.price, 0);
  }
}
