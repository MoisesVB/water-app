import { Constants } from "./constants";
import { StoreLocalService } from "./store-local.service"

describe('StoreLocalService', () => {
    let service: StoreLocalService

    beforeEach(() => {
        service = new StoreLocalService();

        let localStore: { [key: string]: any } = {};

        spyOn(window.localStorage, 'getItem').and.callFake((key) =>
            key in localStore ? localStore[key] : null
        );
        spyOn(window.localStorage, 'setItem').and.callFake(
            (key, value) => (localStore[key] = value + '')
        );
        spyOn(window.localStorage, 'clear').and.callFake(() => (localStore = {}));
    });

    // addGoal tests
    it('#addGoal should add goal to localStorage', () => {
        service.addGoal(2000);

        expect(window.localStorage.getItem('goal')).toBe('2000');
        expect(parseInt(window.localStorage.getItem('goal')!)).toBeGreaterThan(0);
        expect(parseInt(window.localStorage.getItem('goal')!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(window.localStorage.getItem('goal')).toBeTruthy();
    })

    it('#addGoal should throw error if number is 0', () => {
        expect(() => service.addGoal(0)).toThrow(new Error('Received goal is invalid'));
    })

    it('#addGoal should throw error if number is negative', () => {
        expect(() => service.addGoal(-1)).toThrow(new Error('Received goal is invalid'));
    })

    it('#addGoal should throw error if number is greater than MAX_WATER_TARGET', () => {
        expect(() => service.addGoal(Constants.MAX_WATER_TARGET + 1)).toThrow(new Error('Received goal is invalid'));
    })

    it('#addGoal should add goal if number is decimal', () => {
        service.addGoal(2340.50);

        expect(window.localStorage.getItem('goal')).toBe('2340.5');
        expect(parseInt(window.localStorage.getItem('goal')!)).toBeGreaterThan(0);
        expect(parseInt(window.localStorage.getItem('goal')!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(window.localStorage.getItem('goal')).toBeTruthy();
    })

    it('#addGoal should override goal in localStorage', () => {
        service.addGoal(2000);
        service.addGoal(2400);

        expect(window.localStorage.getItem('goal')).toBe('2400');
        expect(parseInt(window.localStorage.getItem('goal')!)).toBeGreaterThan(0);
        expect(parseInt(window.localStorage.getItem('goal')!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(window.localStorage.getItem('goal')).toBeTruthy();
    })

    // getGoal tests
    it('#getGoal should return goal from localStorage', () => {
        window.localStorage.setItem('goal', '2000');

        expect(service.getGoal()).toBe('2000');
        expect(parseInt(service.getGoal()!)).toBeGreaterThan(0);
        expect(parseInt(service.getGoal()!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(service.getGoal()).toBeTruthy();
    })

    it('#getGoal should throw error if goal value is 0', () => {
        window.localStorage.setItem('goal', '0');

        expect(() => service.getGoal()).toThrow(new Error('Goal is invalid'));
    })

    it('#getGoal should throw error if goal value is negative', () => {
        window.localStorage.setItem('goal', '-2340');

        expect(() => service.getGoal()).toThrow(new Error('Goal is invalid'));
    })

    it('#getGoal should throw error if goal value is greater than MAX_WATER_TARGET', () => {
        window.localStorage.setItem('goal', '10001');

        expect(() => service.getGoal()).toThrow(new Error('Goal is invalid'));
    })

    it('#getGoal should return goal if value is decimal', () => {
        window.localStorage.setItem('goal', '2340.5');

        expect(service.getGoal()).toBe('2340.5');
        expect(parseInt(service.getGoal()!)).toBeGreaterThan(0);
        expect(parseInt(service.getGoal()!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(service.getGoal()).toBeTruthy();
    })

    it('#getGoal should throw error if goal value is not compatible with a number', () => {
        window.localStorage.setItem('goal', 'abc-123');

        expect(() => service.getGoal()).toThrow(new Error('Goal is invalid'));
    })

    it('#getGoal should throw error if goal in localStorage is empty', () => {
        window.localStorage.setItem('goal', '');

        expect(() => service.getGoal()).toThrow(new Error('Goal is invalid'));
    })

    it('#getGoal should throw error if there is no goal key in localStorage', () => {
        expect(() => service.getGoal()).toThrow(new Error('Goal is invalid'));
    })

    // intake tests
    it('#addIntake should add intake to localStorage', () => {
        service.addIntake(400);

        expect(window.localStorage.getItem('intake')).toBe('400');
        expect(parseInt(window.localStorage.getItem('intake')!)).toBeGreaterThan(0);
        expect(parseInt(window.localStorage.getItem('intake')!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(window.localStorage.getItem('intake')).toBeTruthy();
    })

    it('#addIntake should throw error if number is 0', () => {
        expect(() => service.addIntake(0)).toThrow(new Error('To update intake is invalid'));
    })

    it('#addIntake should throw error if number is negative', () => {
        expect(() => service.addIntake(-1)).toThrow(new Error('To update intake is invalid'));
    })

    it('#addIntake should throw error if number is greater than MAX_WATER_TARGET', () => {
        expect(() => service.addIntake(Constants.MAX_WATER_TARGET + 1)).toThrow(new Error('To update intake is invalid'));
    })

    it('#addIntake should add intake if number is decimal', () => {
        service.addIntake(324.2);

        expect(window.localStorage.getItem('intake')).toBe('324.2');
        expect(parseInt(window.localStorage.getItem('intake')!)).toBeGreaterThan(0);
        expect(parseInt(window.localStorage.getItem('intake')!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(window.localStorage.getItem('intake')).toBeTruthy();
    })

    it('#addIntake should add intake two times (sum) in localStorage', () => {
        service.addIntake(200);
        service.addIntake(200);

        expect(window.localStorage.getItem('intake')).toBe('400');
        expect(parseInt(window.localStorage.getItem('intake')!)).toBeGreaterThan(0);
        expect(parseInt(window.localStorage.getItem('intake')!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(window.localStorage.getItem('intake')).toBeTruthy();
    })

    it('#addIntake should throw error if intake is added two times and the sum is greater than MAX_WATER_TARGET', () => {
        expect(() => {
            const halfMax = Math.ceil(Constants.MAX_WATER_TARGET / 2);
            service.addIntake(halfMax);
            service.addIntake(halfMax + 1);
        }).toThrow(new Error('To update intake is invalid'));
    })
})