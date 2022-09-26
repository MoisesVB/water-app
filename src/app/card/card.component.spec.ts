import { first } from "rxjs";
import { Cup } from "../cup";
import { CardComponent } from "./card.component";

describe('CardComponent', () => {
    it('raises the click event when clicked', () => {
        const comp = new CardComponent();
        const cup: Cup = { id: 'abcde', capacity: 200, isCustom: false };
        comp.cup = cup;

        comp.selected.pipe(first()).subscribe((selectedCup: string) => expect(selectedCup).toBe(cup.id));
        comp.click();
    });
});