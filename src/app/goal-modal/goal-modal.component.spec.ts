import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GoalModalComponent } from "./goal-modal.component";

describe('GoalModalComp', () => {
    let component: GoalModalComponent;
    let fixture: ComponentFixture<GoalModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({ declarations: [GoalModalComponent] });
        fixture = TestBed.createComponent(GoalModalComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });

    it('should call emitAddGoalOnEnter function on enter', () => {
        spyOn(component, 'emitAddGoalOnEnter');
        document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter' }));

        expect(component.emitAddGoalOnEnter).toHaveBeenCalled();
    });

    it('should not call emitAddGoalOnEnter function on key that is not enter', () => {
        spyOn(component, 'emitAddGoalOnEnter');
        document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Esc' }));

        expect(component.emitAddGoalOnEnter).not.toHaveBeenCalled();
    });

    it('should call emitAddGoal function', () => {
        component.isGoalModalOpen = true;
        component.goal.setValue('2000');

        spyOn(component, 'emitAddGoal');
        document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter' }));

        expect(component.emitAddGoal).toHaveBeenCalled();
    });

    it('should not call emitAddGoal function if goal value is invalid', () => {
        component.isGoalModalOpen = true;
        component.goal.setValue('abc');

        spyOn(component, 'emitAddGoal');
        document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter' }));

        expect(component.emitAddGoal).not.toHaveBeenCalled();
    });
});