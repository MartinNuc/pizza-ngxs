import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { Recipe } from '../recipe';
import { Store, Select } from '@ngxs/store';
import { IngredientsState } from '../ingredients.state';
import { Observable } from 'rxjs';
import { RecipesState, ReloadRecipes, RemoveRecipe } from '../recipes.state';

@Component({
  selector: 'app-recipes-page',
  templateUrl: './recipes-page.component.html',
  styleUrls: ['./recipes-page.component.scss']
})
export class RecipesPageComponent implements OnInit {

  @Select(RecipesState.recipes)
  recipes$: Observable<Recipe[]>;

  edittedRecipe: Recipe;

  constructor(public store: Store) { }

  ngOnInit() {
    this.store.dispatch(new ReloadRecipes());
  }

  edit(recipe: Recipe) {
    this.edittedRecipe = recipe;
  }

  async remove(recipe: Recipe) {
    this.store.dispatch(new RemoveRecipe(recipe));
  }
}
