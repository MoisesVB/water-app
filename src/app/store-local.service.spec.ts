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

    it('#addGoal should add goal to localStorage', () => {
        service.addGoal(2000);

        expect(window.localStorage.getItem('goal')).toBe('2000');
        expect(window.localStorage.getItem('goal')).toBeGreaterThan(0);
        expect(window.localStorage.getItem('goal')).toBeLessThanOrEqual(10000);
        expect(window.localStorage.getItem('goal')).toBeTruthy();
    })

    it('#getGoal should find goal', () => {
        window.localStorage.setItem('goal', '2000');

        expect(service.getGoal()).toBe('2000');
    })

    it('#addIntake should add intake', () => {
        service.addIntake(430);

        expect(window.localStorage.getItem('intake')).toBe('430');
    })

    it('#getIntake should find total intake', () => {
        window.localStorage.setItem('intake', '123');

        expect(service.getIntake()).toBe('123');
    })
})