import { Ingredient } from './ingredient';

export interface IngredientInRecipe {
  count: number;
  ingredient: Ingredient;
}

export interface Recipe {
  id: number;
  name: string;
  ingredients: IngredientInRecipe[];
}
