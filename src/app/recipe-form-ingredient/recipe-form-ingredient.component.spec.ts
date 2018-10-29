import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeFormIngredientComponent } from './recipe-form-ingredient.component';

describe('RecipeFormIngredientComponent', () => {
  let component: RecipeFormIngredientComponent;
  let fixture: ComponentFixture<RecipeFormIngredientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeFormIngredientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeFormIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
