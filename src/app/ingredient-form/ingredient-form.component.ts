import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Ingredient } from '../ingredient';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.scss']
})
export class IngredientFormComponent implements OnInit {
  form: FormGroup;

  @Output()
  save = new EventEmitter<Ingredient>();

  constructor(public fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      id: [],
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(1)]]
    });
  }

  reset() {
    this.form.reset();
  }

  saveForm() {
    const ingredient = this.form.value;
    this.save.emit(ingredient);
  }

  setValue(ingredient: Ingredient) {
    this.form.setValue(ingredient);
  }
}
