import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { FormValidationService } from '../services/form-validation.service';

@Directive({
    selector: '[isAlphanumeric]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: AlphanumericValidatorDirective,
            multi: true
        }
    ]
})
export class AlphanumericValidatorDirective implements Validator {

  constructor(private customValidator: FormValidationService) { }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.customValidator.alphanumericValidator()(control);
  }
}
