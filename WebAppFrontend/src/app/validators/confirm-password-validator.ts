import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

export const ConfirmPasswordValidator : ValidatorFn = (control: FormGroup) : ValidationErrors | null => {
    let password = control.get('password');
    let confirmPassword = control.get('confirmPassword');

    return  password.value === confirmPassword.value ? null : {"doesntMatch" : true};
}