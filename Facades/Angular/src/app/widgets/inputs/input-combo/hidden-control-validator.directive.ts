import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appHiddenControlValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: HiddenControlValidatorDirective, multi: true}]
})
export class HiddenControlValidatorDirective {
  @Input('appHiddenControlValidator') 
  control: AbstractControl;

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.control.errors;
  }
}
