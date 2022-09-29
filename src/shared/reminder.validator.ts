import { AbstractControl } from "@angular/forms";

export function validateReminder(control: AbstractControl) {
    const invalid = Number(control.value) < 0 || Number(control.value) > 1440 || !Number.isInteger(Number(control.value));
    return invalid ? { invalid: { value: control.value } } : null;
}