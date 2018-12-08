import { State, Selector, StateContext, Action } from '@ngxs/store';

import { RecipesService } from '../services/recipes.service';
import { Recipe } from '../models/recipe';
import { tap, mergeMap } from 'rxjs/operators';

export class ReloadRecipes {
  static readonly type = '[Recipes] reload';
}

export class RecipesLoaded {
  static readonly type = '[Recipes] loaded';
  constructor(public payload: Recipe[]) {}
}

export class SaveRecipe {
  static readonly type = '[Recipes] save';
  constructor(public payload: Recipe) {}
}

export class CreateRecipe {
  static readonly type = '[Recipes] create';
  constructor(public payload: Recipe) {}
}

export class EditRecipe {
  static readonly type = '[Recipes] edit';
  constructor(public payload: Recipe) {}
}

export class RemoveRecipe {
  static readonly type = '[Recipes] remove';
  constructor(public payload: Recipe) {}
}

export interface RecipesStateModel {
  recipes: Recipe[];
}

@State<RecipesStateModel>({
  name: 'recipes',
  defaults: {
    recipes: []
  }
})
export class RecipesState {
  @Selector()
  static recipes(state: RecipesStateModel) {
    return state.recipes;
  }

  constructor(private recipesService: RecipesService) {}

  @Action(ReloadRecipes)
  reload(ctx: StateContext<RecipesStateModel>) {
    return this.recipesService
      .load()
      .pipe(mergeMap(recipes => ctx.dispatch(new RecipesLoaded(recipes))));
  }

  @Action(RecipesLoaded)
  onRecipesLoaded(ctx: StateContext<RecipesStateModel>, action: RecipesLoaded) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      recipes: action.payload
    });
  }

  @Action(SaveRecipe)
  saveRecipe(ctx: StateContext<RecipesStateModel>, action: SaveRecipe) {
    return action.payload.id
      ? ctx.dispatch(new EditRecipe(action.payload))
      : ctx.dispatch(new CreateRecipe(action.payload));
  }

  @Action(CreateRecipe)
  createRecipe(ctx: StateContext<RecipesStateModel>, action: CreateRecipe) {
    return this.recipesService
      .create(action.payload)
      .pipe(mergeMap(() => ctx.dispatch(new ReloadRecipes())));
  }

  @Action(EditRecipe)
  editRecipe(ctx: StateContext<RecipesStateModel>, action: CreateRecipe) {
    return this.recipesService
      .edit(action.payload)
      .pipe(mergeMap(() => ctx.dispatch(new ReloadRecipes())));
  }

  @Action(RemoveRecipe)
  RemoveRecipe(ctx: StateContext<RecipesStateModel>, action: RemoveRecipe) {
    return this.recipesService
      .remove(action.payload)
      .pipe(mergeMap(() => ctx.dispatch(new ReloadRecipes())));
  }
}
