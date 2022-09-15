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

    it('#findGoal should find goal', () => {
        window.localStorage.setItem('goal', '2000');

        expect(service.findGoal()).toBe('2000');
    })

    it('#addGoal should add goal', () => {
        service.addGoal(2000);

        expect(window.localStorage.getItem('goal')).toBe('2000');
    })

    it('#addIntake should add intake', () => {
        service.addIntake(430);

        expect(window.localStorage.getItem('intake')).toBe('430');
    })

    it('#findIntake should find total intake', () => {
        window.localStorage.setItem('intake', '123');

        expect(service.findIntake()).toBe('123');
    })
})