import { Ingredient } from '../models/ingredient';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { IngredientsService } from '../services/ingredients.service';
import { mergeMap } from 'rxjs/operators';

export class ReloadIngredients {
  static readonly type = '[Ingredients] reload';
}

export class IngredientsLoaded {
  static readonly type = '[Ingredients] loaded';
  constructor(public payload: Ingredient[]) {}
}

export class SaveIngredient {
  static readonly type = '[Ingredients] save';
  constructor(public payload: Ingredient) {}
}

export class CreateIngredient {
  static readonly type = '[Ingredients] create';
  constructor(public payload: Ingredient) {}
}

export class RemoveIngredient {
  static readonly type = '[Ingredients] remove';
  constructor(public payload: Ingredient) {}
}

export class UpdateIngredient {
  static readonly type = '[Ingredients] update';
  constructor(public payload: Ingredient) {}
}

export class EditIngredient {
  static readonly type = '[Ingredients] edit';
  constructor(public payload: Ingredient) {}
}

export interface IngredientsStateModel {
  ingredients: Ingredient[];
  edittedIngredient: Ingredient | null;
}

@State<IngredientsStateModel>({
  name: 'ingredients',
  defaults: {
    edittedIngredient: null,
    ingredients: []
  }
})
export class IngredientsState {
  @Selector()
  static ingredients(state: IngredientsStateModel) {
    return state.ingredients;
  }

  constructor(private ingredientsService: IngredientsService) {}

  @Action(EditIngredient)
  editIngredient(ctx: StateContext<IngredientsStateModel>, action: SaveIngredient) {
    ctx.patchState({
      edittedIngredient: action.payload
    });
  }

  @Action(SaveIngredient)
  saveIngredient(ctx: StateContext<IngredientsStateModel>, action: SaveIngredient) {
    return action.payload.id ? ctx.dispatch(new UpdateIngredient(action.payload)) : ctx.dispatch(new CreateIngredient(action.payload));
  }

  @Action(CreateIngredient)
  createIngredient(ctx: StateContext<IngredientsStateModel>, action: CreateIngredient) {
    return this.ingredientsService.create(action.payload).pipe(
      mergeMap(() => ctx.dispatch(new ReloadIngredients()))
    );
  }

  @Action(UpdateIngredient)
  updateIngredient(ctx: StateContext<IngredientsStateModel>, action: UpdateIngredient) {
    return this.ingredientsService.edit(action.payload).pipe(
      mergeMap(() => ctx.dispatch(new ReloadIngredients()))
    );
  }

  @Action(RemoveIngredient)
  removeIngredient(ctx: StateContext<IngredientsStateModel>, action: RemoveIngredient) {
    return this.ingredientsService.remove(action.payload).pipe(
      mergeMap(() => ctx.dispatch(new ReloadIngredients()))
    );
  }

  @Action(ReloadIngredients)
  reloadIngredient(ctx: StateContext<IngredientsStateModel>, action: ReloadIngredients) {
    return this.ingredientsService.load().pipe(
      mergeMap((ingredients) => ctx.dispatch(new IngredientsLoaded(ingredients)))
    );
  }

  @Action(IngredientsLoaded)
  onIngredientsLoaded(ctx: StateContext<IngredientsStateModel>, action: IngredientsLoaded) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      ingredients: action.payload
    });
  }
}
