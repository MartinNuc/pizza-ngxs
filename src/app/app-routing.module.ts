import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesPageComponent } from './recipes-page/recipes-page.component';
import { IngredientsPageComponent } from './ingredients-page/ingredients-page.component';
import { IngredientsService } from './ingredients.service';
import { RecipesService } from './recipes.service';

const routes: Routes = [
  {
    path: 'recipes',
    component: RecipesPageComponent
  },
  {
    path: 'ingredients',
    component: IngredientsPageComponent
  },
  {
    path: '',
    redirectTo: 'recipes',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
