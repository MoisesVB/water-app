import { AbstractControl } from "@angular/forms";
import { CupIcon } from "./models/cup-icon";

export function validateIcon(control: AbstractControl) {
    const invalid = !Object.values(CupIcon).includes(control.value as CupIcon);
    return invalid ? { invalid: { value: control.value } } : null;
}