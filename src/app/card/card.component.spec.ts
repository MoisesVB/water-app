import { ComponentFixture, TestBed } from "@angular/core/testing";
import { first } from "rxjs";
import { Cup } from "../cup";
import { CardComponent } from "./card.component";

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({ declarations: [CardComponent] });
        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });

    it('raises the click event when clicked', () => {
        const cup: Cup = { id: 'abcde', capacity: 200, isCustom: false };
        component.cup = cup;

        fixture.detectChanges();

        component.selected.pipe(first()).subscribe((selectedCup: string) => expect(selectedCup).toBe(cup.id));
        component.click();
    });

    it('<div> should have white background and black text when cup id is the same as the selected cup', () => {
        component.cup = { id: 'abcde', capacity: 200, isCustom: false };
        component.selectedCup = 'abcde';

        fixture.detectChanges();

        const cardElement: HTMLElement = fixture.nativeElement;
        const div = cardElement.querySelector('div')!; // first div
        expect(div.classList.contains('bg-white')).toBeTrue();
        expect(div.classList.contains('text-black')).toBeTrue();
    });

    it('<div> should have black background and white text when cup id is not the same as the selected cup', () => {
        component.cup = { id: 'abcde', capacity: 200, isCustom: false };
        component.selectedCup = 'qwert';

        fixture.detectChanges();

        const cardElement: HTMLElement = fixture.nativeElement;
        const div = cardElement.querySelector('div')!;
        expect(div.classList.contains('bg-black')).toBeTrue();
        expect(div.classList.contains('text-white')).toBeTrue();
    });

    it('should have <h3> with "500ml"', () => {
        component.cup = { id: 'qwert', capacity: 500, isCustom: false };

        fixture.detectChanges();

        const cardElement: HTMLElement = fixture.nativeElement;
        const h3 = cardElement.querySelector('h3')!;
        expect(h3.textContent).toEqual('500ml');
    })
});