import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class FormValidationService {
    alphanumericValidator(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            if (!control.value) {
                return null;
            }
            const regex = new RegExp('^[a-zA-Z0-9]*$');
            const valid = regex.test(control.value);
            return valid ? null : { notAlphanumeric: true };
        };
    }
}
