import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsPageComponent } from './ingredients-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IngredientFormComponent } from '../ingredient-form/ingredient-form.component';

describe('NewIngredientPageComponent', () => {
  let component: IngredientsPageComponent;
  let fixture: ComponentFixture<IngredientsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientsPageComponent, IngredientFormComponent ],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
