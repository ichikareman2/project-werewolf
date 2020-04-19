import { NgModule } from '@angular/core';
import { AlphanumericValidatorDirective } from '../directives/alphanumeric-validator.directive';

// Making a module that is reusable for join and create forms
// reference: https://stackoverflow.com/questions/56734884/how-to-use-directive-in-more-then-one-module-in-angular-2/56734947
@NgModule({
  exports: [AlphanumericValidatorDirective],
  declarations: [AlphanumericValidatorDirective],
})
export class ValidateFormsModule { }
