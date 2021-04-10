import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidatorsService {
  constructor() {}

  private changePasswordConfirmStatus(
    valid: boolean,
    control: AbstractControl,
    matchTo: string,
    errorBool: { disappear: boolean }
  ) {
    if (valid) {
      control.parent.controls[matchTo].errors = null;
      control.parent.controls[matchTo].status = 'VALID';
      errorBool.disappear = true;
    } else {
      control.parent.controls[matchTo].errors = { notMatching: true };
      control.parent.controls[matchTo].status = 'INVALID';
      errorBool.disappear = false;
    }
  }

  changeMatchPassword(
    matchTo: string,
    errorBool: { disappear: boolean },
    errorDelay: number
  ): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      const isMatching = control.parent?.controls[matchTo]?.value === control.value;
      if (!isMatching) {
        await this.sleep(errorDelay);
        if (
          !!control.parent?.controls[matchTo]?.value &&
          control.parent?.controls[matchTo]?.value !== control.value
        ) {
          this.changePasswordConfirmStatus(false, control, matchTo, errorBool);
        } else if (!!control.parent?.controls[matchTo]?.value) {
          this.changePasswordConfirmStatus(true, control, matchTo, errorBool);
        }
      } else if (!!control.parent?.controls[matchTo]?.value) {
        this.changePasswordConfirmStatus(true, control, matchTo, errorBool);
      }
      return null;
    };
  }

  email(errorBool: { disappear: boolean }, errorDelay: number): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      if (!!control.value) {
        if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/.test(control.value)) {
          await this.sleep(errorDelay);
          if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/.test(control.value)) {
            errorBool.disappear = false;
            return { email: true};
          }
        }
      }
      errorBool.disappear = true;
      return null;
    };
  }

  matchPassword(
    matchTo: string,
    errorBool: { disappear: boolean },
    errorDelay: number
  ): AsyncValidatorFn {
    return async (control: AbstractControl): Promise<ValidationErrors | null> => {
      if (!!control.value && !!control.parent.controls[matchTo]?.value) {
        // if (control.value !== '' && control.parent.controls[matchTo].value !== '') {
        if (!(control.value === control.parent.controls[matchTo].value))
          await this.sleep(errorDelay);
        if (control.value === control.parent.controls[matchTo].value) {
          errorBool.disappear = true;
          return null;
        } else {
          errorBool.disappear = false;
          return { notMatching: true };
        }
      }
      errorBool.disappear = true;
      return null;
    };
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  validatorMinMax(
    controlName: string,
    form: FormGroup,
    errorBool: { disappear: boolean },
    errorDelay: number
  ): AsyncValidatorFn {
    return async (): Promise<ValidationErrors | null> => {
      if (form.get(controlName).value?.length < 8) {
        await this.sleep(errorDelay);
        if (form.get(controlName).value?.length < 8) {
          errorBool.disappear = false;
          return { minLengthError: true };
        } else {
          errorBool.disappear = true;
          return null;
        }
      }
      errorBool.disappear = true;
      return null;
    };
  }
}
