import { AbstractControl, FormGroup } from '@angular/forms';
export function PasswordMatch(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: FormGroup) => {
    let control = formGroup.controls[controlName];
    let matchingControl = formGroup.controls[matchingControlName];
    if (
      matchingControl.errors &&
      !matchingControl.errors['confirmPasswordValidator']
    )
      return;

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ passwordMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
