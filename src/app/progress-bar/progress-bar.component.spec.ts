import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProgressBarComponent } from "./progress-bar.component";

describe('ProgressBarComp', () => {
    let component: ProgressBarComponent;
    let fixture: ComponentFixture<ProgressBarComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({ declarations: [ProgressBarComponent] });
        fixture = TestBed.createComponent(ProgressBarComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });

    it('should have <h3> with "560ml/2000ml"', () => {
        component.goal = 2000;
        component.intake = 560;

        fixture.detectChanges();

        const progressBarElement: HTMLElement = fixture.nativeElement;
        const h3 = progressBarElement.querySelector('h3')!;
        expect(h3.textContent).toEqual('560ml/2000ml');
    });

    it('should have <h3> with "Goal Achieved" if intake is the same as goal', () => {
        component.goal = 2000;
        component.intake = 2000;

        fixture.detectChanges();

        const progressBarElement: HTMLElement = fixture.nativeElement;
        const h3 = progressBarElement.querySelectorAll('h3')[1]!;
        expect(h3.textContent).toEqual('Goal Achieved');
    });

    it('should have <h3> with "Goal Achieved" if intake is greater than goal', () => {
        component.goal = 2000;
        component.intake = 2400;

        fixture.detectChanges();

        const progressBarElement: HTMLElement = fixture.nativeElement;
        const h3 = progressBarElement.querySelectorAll('h3')[1]!;
        expect(h3.textContent).toEqual('Goal Achieved');
    });

    it('should have <h3> not defined when goal is not achieved', () => {
        component.goal = 2000;
        component.intake = 800;

        fixture.detectChanges();

        const progressBarElement: HTMLElement = fixture.nativeElement;
        const h3 = progressBarElement.querySelectorAll('h3')[1]!;
        expect(h3).toBeUndefined();
    });

    it('should have <div> with shadow effects applied', () => {
        component.goal = 2000;
        component.intake = 2300;

        fixture.detectChanges();

        const progressBarElement: HTMLElement = fixture.nativeElement;
        const div = progressBarElement.querySelectorAll('div')[2]!;
        expect(div.classList.contains('border-blue-300')).toBeTrue();
        expect(div.classList.contains('shadow-xl')).toBeTrue();
        expect(div.classList.contains('shadow-blue-500/50')).toBeTrue();
    });

    it('should not have <div> with shadow effects applied', () => {
        component.goal = 2000;
        component.intake = 1200;

        fixture.detectChanges();

        const progressBarElement: HTMLElement = fixture.nativeElement;
        const div = progressBarElement.querySelectorAll('div')[2]!;

        expect(div.classList.contains('border-white')).toBeTrue();
        expect(div.classList.contains('border-blue-300')).toBeFalse();
        expect(div.classList.contains('shadow-xl')).toBeFalse();
        expect(div.classList.contains('shadow-blue-500/50')).toBeFalse();
    });

    it('should have <div> with 25% width', () => {
        component.progressBarPercentage = 25;

        fixture.detectChanges();

        const progressBarElement: HTMLElement = fixture.nativeElement;
        const div = progressBarElement.querySelectorAll('div')[3]!;

        expect(div.style.width).toBe('25%');
    });

    it('should have <div> with bg-blue-600 applied', () => {
        component.goal = 2000;
        component.intake = 2100;

        fixture.detectChanges();

        const progressBarElement: HTMLElement = fixture.nativeElement;
        const div = progressBarElement.querySelectorAll('div')[3]!;

        expect(div.classList.contains('bg-blue-600')).toBeTrue();
    });

    it('should have <div> with bg-blue-500 applied', () => {
        component.goal = 2000;
        component.intake = 300;

        fixture.detectChanges();

        const progressBarElement: HTMLElement = fixture.nativeElement;
        const div = progressBarElement.querySelectorAll('div')[3]!;

        expect(div.classList.contains('bg-blue-500')).toBeTrue();
    });

    it('should have <p> with text-blue-400 applied', () => {
        component.goal = 2000;
        component.intake = 2300;

        fixture.detectChanges();

        const progressBarElement: HTMLElement = fixture.nativeElement;
        const p = progressBarElement.querySelector('p')!;

        expect(p.classList.contains('text-blue-400')).toBeTrue();
    });

    it('should have <p> with text-blue-300 applied', () => {
        component.goal = 2000;
        component.intake = 100;

        fixture.detectChanges();

        const progressBarElement: HTMLElement = fixture.nativeElement;
        const p = progressBarElement.querySelector('p')!;

        expect(p.classList.contains('text-blue-300')).toBeTrue();
    });

    it('should have <p> with "50%"', () => {
        component.progressBarPercentage = 50;

        fixture.detectChanges();

        const progressBarElement: HTMLElement = fixture.nativeElement;
        const p = progressBarElement.querySelector('p')!;

        expect(p.textContent).toEqual('50%');
    });
});