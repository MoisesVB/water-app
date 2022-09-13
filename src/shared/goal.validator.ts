import { AbstractControl } from "@angular/forms";

export function validateGoal(control: AbstractControl) {
    const invalid = control.value <= 0 || control.value > 20000;
    return invalid ? { invalid: { value: control.value } } : null;
}