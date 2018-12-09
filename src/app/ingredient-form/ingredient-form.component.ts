import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Ingredient } from '../models/ingredient';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.scss']
})
export class IngredientFormComponent {
  form: FormGroup;

  @Input()
  set ingredient(value) {
    this.form.reset();
    if (value) {
      this.form.setValue(value);
    }
  }

  @Output()
  save = new EventEmitter<Ingredient>();

  constructor(public fb: FormBuilder) {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      id: [],
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(1)]]
    });
  }

  saveForm() {
    const ingredient = this.form.value;
    this.save.emit(ingredient);
  }
}
