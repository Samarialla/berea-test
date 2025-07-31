import { AbstractControl, ValidationErrors } from '@angular/forms';

export function imageUrlValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i;
  return imageRegex.test(value) ? null : { invalidImageUrl: true };
}