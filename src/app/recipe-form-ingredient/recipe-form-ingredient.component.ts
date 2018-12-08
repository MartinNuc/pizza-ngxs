import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
  FormBuilder,
  Validators,
  Validator,
  AbstractControl,
  ValidationErrors,
  NG_VALIDATORS
} from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Ingredient } from '../ingredient';
import { Store } from '@ngxs/store';
import { ReloadIngredients } from '../ingredients.state';

@Component({
  selector: 'app-recipe-form-ingredient',
  templateUrl: './recipe-form-ingredient.component.html',
  styleUrls: ['./recipe-form-ingredient.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RecipeFormIngredientComponent), // forward the reference,
      multi: true // allow multiple component in the same form
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RecipeFormIngredientComponent),
      multi: true
    }
  ]
})
export class RecipeFormIngredientComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  form: FormGroup;

  ingredients$: Observable<Ingredient[]>;

  onTouched: any;
  onChanged: any;
  changesSubscription: Subscription;

  constructor(public store: Store, public fb: FormBuilder) {}

  ngOnInit() {
    this.ingredients$ = this.store.select(state => state.ingredients.ingredients);
    this.store.dispatch(new ReloadIngredients());
    this.form = this.fb.group({
      count: [0, [Validators.required, Validators.min(1)]],
      ingredient: [null, [Validators.required]]
    });
    this.changesSubscription = this.form.valueChanges.subscribe(value => {
      if (this.onTouched) { this.onTouched(); }
      if (this.onChanged) { this.onChanged(value); }
    });
  }

  ngOnDestroy() {
    this.changesSubscription.unsubscribe();
  }

  writeValue(val: any): void {
    if (!val) {
      return this.form.reset();
    }
    this.form.patchValue(val, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  validate(_: AbstractControl): ValidationErrors {
    return this.form.valid ? null : { incompleteIngredientInRecipe: true };
  }

  compareById(a: Ingredient, b: Ingredient) {
    return a && b && a.id === b.id;
  }
}
