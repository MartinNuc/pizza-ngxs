import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../services/recipes.service';
import { Recipe } from '../models/recipe';
import { Store, Select } from '@ngxs/store';
import { IngredientsState } from '../store/ingredients.state';
import { Observable } from 'rxjs';
import { RecipesState, ReloadRecipes, RemoveRecipe } from '../store/recipes.state';

@Component({
  selector: 'app-recipes-page',
  templateUrl: './recipes-page.component.html',
  styleUrls: ['./recipes-page.component.scss']
})
export class RecipesPageComponent implements OnInit {

  recipes$: Observable<Recipe[]>;

  edittedRecipe: Recipe;

  constructor(public store: Store) { }

  ngOnInit() {
    this.recipes$ = this.store.select(state => state.recipes.recipes);
    this.store.dispatch(new ReloadRecipes());
  }

  edit(recipe: Recipe) {
    this.edittedRecipe = recipe;
  }

  async remove(recipe: Recipe) {
    this.store.dispatch(new RemoveRecipe(recipe));
  }
}
