import { AbstractControl } from "@angular/forms";
import { Constants } from "src/app/constants";

export function validateGoal(control: AbstractControl) {
    const invalid = control.value <= 0 || control.value > Constants.MAX_WATER_TARGET;
    return invalid ? { invalid: { value: control.value } } : null;
}