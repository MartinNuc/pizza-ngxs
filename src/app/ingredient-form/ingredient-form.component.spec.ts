import { IngredientFormComponent } from './ingredient-form.component';
import { createHostComponentFactory, Spectator, createTestComponentFactory } from '@netbasal/spectator';
import { ReactiveFormsModule } from '@angular/forms';
import { Ingredient } from '../models/ingredient';

describe('IngredientFormComponent with host', () => {
  const createHost = createHostComponentFactory({
    component: IngredientFormComponent,
    imports: [ReactiveFormsModule]
  });

  it('should disable submit button when form is invalid', () => {
    const host = createHost(`<app-ingredient-form></app-ingredient-form>`);
    expect(host.component.form.valid).toBe(false);
    const saveButton = host.query('button');
    expect(saveButton).toHaveProperty('disabled', true);
  });

  it('should mark form valid on entering data', () => {
    const host = createHost(`<app-ingredient-form></app-ingredient-form>`);
    const nameInput = host.query('input[name="name"]');
    const priceInput = host.query('input[name="price"]');
    expect(host.component.form.valid).toBe(false);
    host.typeInElement('Testing ingredient', nameInput);
    host.typeInElement('120', priceInput);
    host.detectChanges();
    expect(host.component.form.valid).toBe(true);
  });
});

describe('IngredientFormComponent', () => {
  const createComponent = createTestComponentFactory({
    component: IngredientFormComponent,
    imports: [ReactiveFormsModule]
  });

  it('should update form when ingredient input changes', () => {
    const spectator = createComponent({});
    spectator.detectChanges();
    spyOn(spectator.component.form, 'reset');
    spectator.setInput('ingredient', {
      id: 5,
      name: 'Garlic',
      price: 22
    });
    expect(spectator.component.form.reset).toHaveBeenCalled();
    expect(spectator.query<HTMLInputElement>('input[name="name"]').value).toBe('Garlic');
  });

  it('should emit the form values on submit', () => {
    const spectator = createComponent({}, false);
    let output: Ingredient;
    spectator
      .output<Ingredient>('save')
      .subscribe(result => output = result);
    spectator.detectChanges();
    spectator.component.form.patchValue({ name: 'testing', price: 120 });
    spectator.component.saveForm();
    expect(output).toEqual({
      id: null,
      name: 'testing',
      price: 120
    });
  });
});
