import { Activity } from "./activity";
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
        expect(Number(window.localStorage.getItem('goal')!)).toBeGreaterThan(0);
        expect(Number(window.localStorage.getItem('goal')!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
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

    it('#addGoal should throw error if number is decimal', () => {
        expect(() => service.addGoal(2340.50)).toThrow(new Error('Received goal is invalid'));
    })

    it('#addGoal should override goal in localStorage', () => {
        service.addGoal(2000);
        service.addGoal(2400);

        expect(window.localStorage.getItem('goal')).toBe('2400');
        expect(Number(window.localStorage.getItem('goal')!)).toBeGreaterThan(0);
        expect(Number(window.localStorage.getItem('goal')!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(window.localStorage.getItem('goal')).toBeTruthy();
    })

    // getGoal tests
    it('#getGoal should return goal from localStorage', () => {
        window.localStorage.setItem('goal', '2000');

        expect(service.getGoal()).toBe('2000');
        expect(Number(service.getGoal()!)).toBeGreaterThan(0);
        expect(Number(service.getGoal()!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
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
        window.localStorage.setItem('goal', JSON.stringify(Constants.MAX_WATER_TARGET + 1));

        expect(() => service.getGoal()).toThrow(new Error('Goal is invalid'));
    })

    it('#getGoal should throw error if goal value is decimal', () => {
        window.localStorage.setItem('goal', '2340.56');

        expect(() => service.getGoal()).toThrow(new Error('Goal is invalid'));
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

    // addIntake tests
    it('#addIntake should add intake to localStorage', () => {
        // spy on inner function 'getIntake' of addIntake()
        // same return (without validation)
        spyOn(service, 'getIntake').and.callFake(() => window.localStorage.getItem('intake')!);

        service.addIntake(400);

        expect(window.localStorage.getItem('intake')).toBe('400');
        expect(Number(window.localStorage.getItem('intake')!)).toBeGreaterThan(0);
        expect(Number(window.localStorage.getItem('intake')!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(window.localStorage.getItem('intake')).toBeTruthy();
    })

    it('#addIntake should throw error if number is 0', () => {
        spyOn(service, 'getIntake').and.callFake(() => window.localStorage.getItem('intake')!);

        expect(() => service.addIntake(0)).toThrow(new Error('To update intake is invalid'));
    })

    it('#addIntake should throw error if number is negative', () => {
        spyOn(service, 'getIntake').and.callFake(() => window.localStorage.getItem('intake')!);

        expect(() => service.addIntake(-1)).toThrow(new Error('To update intake is invalid'));
    })

    it('#addIntake should throw error if number is greater than MAX_WATER_TARGET', () => {
        spyOn(service, 'getIntake').and.callFake(() => window.localStorage.getItem('intake')!);

        expect(() => service.addIntake(Constants.MAX_WATER_TARGET + 1)).toThrow(new Error('To update intake is invalid'));
    })

    it('#addIntake should throw error if number is decimal', () => {
        expect(() => service.addIntake(324.44)).toThrow(new Error('To update intake is invalid'));
    })

    it('#addIntake should add intake two times (sum) in localStorage', () => {
        spyOn(service, 'getIntake').and.callFake(() => window.localStorage.getItem('intake')!);

        service.addIntake(200);
        service.addIntake(200);

        expect(window.localStorage.getItem('intake')).toBe('400');
        expect(Number(window.localStorage.getItem('intake')!)).toBeGreaterThan(0);
        expect(Number(window.localStorage.getItem('intake')!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(window.localStorage.getItem('intake')).toBeTruthy();
    })

    it('#addIntake should throw error if intake is added two times and the sum is greater than MAX_WATER_TARGET', () => {
        spyOn(service, 'getIntake').and.callFake(() => window.localStorage.getItem('intake')!);

        expect(() => {
            const halfMax = Math.ceil(Constants.MAX_WATER_TARGET / 2);
            service.addIntake(halfMax);
            service.addIntake(halfMax + 1);
        }).toThrow(new Error('To update intake is invalid'));
    })

    // getIntake tests
    it('#getIntake should return intake from localStorage', () => {
        window.localStorage.setItem('intake', '400');

        expect(service.getIntake()).toBe('400');
        expect(Number(service.getIntake()!)).toBeGreaterThan(0);
        expect(Number(service.getIntake()!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(service.getIntake()).toBeTruthy();
    })

    it('#getIntake should throw error if intake value is 0', () => {
        window.localStorage.setItem('intake', '0');

        expect(() => service.getIntake()).toThrow(new Error('Intake is invalid'));
    })

    it('#getIntake should throw error if intake value is negative', () => {
        window.localStorage.setItem('intake', '-300');

        expect(() => service.getIntake()).toThrow(new Error('Intake is invalid'));
    })

    it('#getIntake should throw error if intake value is greater than MAX_WATER_TARGET', () => {
        window.localStorage.setItem('intake', JSON.stringify(Constants.MAX_WATER_TARGET + 1));

        expect(() => service.getIntake()).toThrow(new Error('Intake is invalid'));
    })

    it('#getIntake should throw error if value is decimal', () => {
        window.localStorage.setItem('intake', '500.50');

        expect(() => service.getIntake()).toThrow(new Error('Intake is invalid'));
    })

    it('#getIntake should throw error if intake value is not compatible with a number', () => {
        window.localStorage.setItem('intake', 'abc-123');

        expect(() => service.getIntake()).toThrow(new Error('Intake is invalid'));
    })

    it('#getIntake should throw error if intake in localStorage is empty', () => {
        window.localStorage.setItem('intake', '');

        expect(() => service.getIntake()).toThrow(new Error('Intake is invalid'));
    })

    it('#getIntake should throw error if there is no intake key in localStorage', () => {
        expect(() => service.getIntake()).toThrow(new Error('Intake is invalid'));
    })

    // deleteIntake tests
    it('#deleteIntake should delete intake of localStorage', () => {
        spyOn(service, 'getIntake').and.callFake(() => window.localStorage.getItem('intake')!);

        window.localStorage.setItem('intake', '500');
        service.deleteIntake(250);

        expect(window.localStorage.getItem('intake')).toBe('250');
        expect(Number(window.localStorage.getItem('intake')!)).toBeGreaterThan(0);
        expect(Number(window.localStorage.getItem('intake')!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(window.localStorage.getItem('intake')).toBeTruthy();
    })

    it('#deleteIntake should throw error if number is 0', () => {
        expect(() => service.deleteIntake(0)).toThrow(new Error('Intake to delete is invalid'));
    })

    it('#deleteIntake should throw error if number is negative', () => {
        expect(() => service.deleteIntake(-1)).toThrow(new Error('Intake to delete is invalid'));
    })

    it('#deleteIntake should throw error if number is greater than MAX_WATER_TARGET', () => {
        expect(() => service.deleteIntake(Constants.MAX_WATER_TARGET + 1)).toThrow(new Error('Intake to delete is invalid'));
    })

    it('#deleteIntake should throw error if number is decimal', () => {
        expect(() => service.deleteIntake(540.3)).toThrow(new Error('Intake to delete is invalid'));
    })

    it('#deleteIntake should delete intake two times (subtraction) in localStorage', () => {
        spyOn(service, 'getIntake').and.callFake(() => window.localStorage.getItem('intake')!);

        window.localStorage.setItem('intake', '1500');
        service.deleteIntake(250);
        service.deleteIntake(100);

        expect(window.localStorage.getItem('intake')).toBe('1150');
        expect(Number(window.localStorage.getItem('intake')!)).toBeGreaterThan(0);
        expect(Number(window.localStorage.getItem('intake')!)).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(window.localStorage.getItem('intake')).toBeTruthy();
    })

    it('#deleteIntake should throw error if intake is deleted two times and the subtraction is less than 0', () => {
        spyOn(service, 'getIntake').and.callFake(() => window.localStorage.getItem('intake')!);
        window.localStorage.setItem('intake', '1000');

        expect(() => {
            const half = Math.ceil(Number(window.localStorage.getItem('intake')) / 2);

            service.deleteIntake(half);
            service.deleteIntake(half + 1);
        }).toThrow(new Error('Intake to delete is invalid'));
    })

    // addActivity tests
    it('#addActivity should add activity to localStorage', () => {
        spyOn(service, 'getAllActivity').and.callFake(() => window.localStorage.getItem('activity')!);

        service.addActivity(230);

        const date = new Date().toLocaleDateString(); // today date
        const obj = JSON.parse(window.localStorage.getItem('activity')!);
        const todayObj = obj[`${date}`][0];

        expect(obj[`${date}`]).toBeTruthy();

        expect(todayObj.id).toBeTruthy();
        expect(todayObj.hour).toBeTruthy();

        expect(todayObj.intake).toBe(230);
        expect(todayObj.intake).toBeGreaterThan(0);
        expect(todayObj.intake).toBeLessThanOrEqual(Constants.MAX_WATER_TARGET);
        expect(todayObj.intake).toBeTruthy();
    })

    it('#addActivity should throw error if number is 0', () => {
        expect(() => service.addActivity(0)).toThrow(new Error('Intake is invalid'));
    })

    it('#addActivity should throw error if number is negative', () => {
        expect(() => service.addActivity(-1)).toThrow(new Error('Intake is invalid'));
    })

    it('#addActivity should throw error if number is greater than MAX_WATER_TARGET', () => {
        expect(() => service.addActivity(Constants.MAX_WATER_TARGET + 1)).toThrow(new Error('Intake is invalid'));
    })

    it('#addActivity should throw error if number is decimal', () => {
        expect(() => service.addActivity(324.44)).toThrow(new Error('Intake is invalid'));
    })

    it('#addActivity should add activity two times in localStorage', () => {
        spyOn(service, 'getAllActivity').and.callFake(() => window.localStorage.getItem('activity')!);

        service.addActivity(230);
        service.addActivity(500);

        const date = new Date().toLocaleDateString(); // today date
        const obj = JSON.parse(window.localStorage.getItem('activity')!);
        const todayObj = obj[`${date}`];

        expect(todayObj).toBeTruthy();
        expect(todayObj.length).toBe(2);
    })

    // getAllActivity tests
    it('#getAllActivity should return activity from localStorage', () => {
        const activity: Activity = {
            '1/14/2022': [{ id: 'abcde', hour: '11:00:00 AM', intake: 400 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(JSON.parse(service.getAllActivity()!)).toBeTruthy();
        expect(Object.keys(JSON.parse(service.getAllActivity()!)).length).toBe(1); // check length of date keys
        expect(JSON.parse(service.getAllActivity()!)['1/14/2022'].length).toBe(1); // check length of array inside date key
    })

    it('#getAllActivity should throw error if activity intake is 0', () => {
        const activity: Activity = {
            '4/3/2022': [{ id: 'qwert', hour: '12:35:45 PM', intake: 0 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid activity found'));
    })

    it('#getAllActivity should throw error if activity intake is negative', () => {
        const activity: Activity = {
            '4/3/2022': [{ id: 'qwert', hour: '12:35:45 PM', intake: -10 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid activity found'));
    })

    it('#getAllActivity should throw error if activity intake is greater than MAX_WATER_TARGET', () => {
        const activity: Activity = {
            '4/3/2022': [{ id: 'qwert', hour: '12:35:45 PM', intake: Constants.MAX_WATER_TARGET + 1 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid activity found'));
    })

    it('#getAllActivity should throw error if intake value is decimal', () => {
        const activity: Activity = {
            '4/3/2022': [{ id: 'qwert', hour: '12:35:45 PM', intake: 120.50 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid activity found'));
    })

    it('#getAllActivity should throw error if activity intake is not compatible with a number', () => {
        const activity = {
            '4/3/2022': [{ id: 'qwert', hour: '12:35:45 PM', intake: 'abcde' }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid activity found'));
    })

    it('#getAllActivity should throw error if activity in localStorage is empty', () => {
        window.localStorage.setItem('activity', '');

        expect(() => service.getAllActivity()).toThrow(new Error('Error parsing activities'));
    })

    it('#getAllActivity should throw error if there is no activity key in localStorage', () => {
        expect(() => service.getAllActivity()).toThrow(new Error('Activity is falsy'));
    })

    it('#getAllActivity should throw error if date key is not a date', () => {
        const activity: Activity = {
            'key': [{ id: 'qwert', hour: '12:35:45 PM', intake: 200 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid date key'));
    })

    it('#getAllActivity should throw error if date key is empty', () => {
        const activity: Activity = {
            '': [{ id: 'qwert', hour: '12:35:45 PM', intake: 200 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid date key'));
    })

    it('#getAllActivity should throw error if date key is a number', () => {
        const activity: Activity = {
            12032021: [{ id: 'qwert', hour: '12:35:45 PM', intake: 200 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid date key'));
    })

    it('#getAllActivity should throw error if date key is falsy', () => {
        const activity: Activity = {
            null: [{ id: 'qwert', hour: '12:35:45 PM', intake: 200 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid date key'));
    })

    it('#getAllActivity should throw error if id is a number', () => {
        const activity = {
            '1/14/2022': [{ id: 1234, hour: '12:35:45 PM', intake: 200 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid activity found'));
    })

    it('#getAllActivity should throw error if id is falsy', () => {
        const activity = {
            '1/14/2022': [{ id: null, hour: '12:35:45 PM', intake: 200 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid activity found'));
    })

    it('#getAllActivity should throw error if id is empty', () => {
        const activity = {
            '1/14/2022': [{ id: '', hour: '12:35:45 PM', intake: 200 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid activity found'));
    })

    it('#getAllActivity should throw error if hour is a number', () => {
        const activity = {
            '1/14/2022': [{ id: 'qewrt', hour: 123500, intake: 200 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid activity found'));
    })

    it('#getAllActivity should throw error if hour is falsy', () => {
        const activity = {
            '1/14/2022': [{ id: 'qewrt', hour: null, intake: 200 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid activity found'));
    })

    it('#getAllActivity should throw error if hour is empty', () => {
        const activity = {
            '1/14/2022': [{ id: 'qewrt', hour: '', intake: 200 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.getAllActivity()).toThrow(new Error('Invalid activity found'));
    })

    // deleteActivityById tests
    it('#deleteActivityById should delete activity of localStorage', () => {
        spyOn(service, 'getAllActivity').and.callFake(() => window.localStorage.getItem('activity')!);

        const activity: Activity = {
            '1/14/2022': [{
                id: 'abcde',
                hour: '11:00:00 AM',
                intake: 400
            },
            {
                id: '900ff',
                hour: '4:23:30 PM',
                intake: 550
            }],
            '4/30/2022': [{ id: '5tytt', hour: '9:43:42 AM', intake: 100 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));
        service.deleteActivityById('900ff');

        expect(Object.keys(JSON.parse(window.localStorage.getItem('activity')!)).length).toBe(2);
        expect(JSON.parse(window.localStorage.getItem('activity')!)['1/14/2022'].length).toBe(1);
        expect(JSON.parse(window.localStorage.getItem('activity')!)['1/14/2022'][1]).toBeUndefined();
    })

    it('#deleteActivityById should throw error if id is invalid', () => {
        expect(() => service.deleteActivityById('')).toThrow(new Error('Id is invalid'));
    })

    it('#deleteActivityById should throw error if activity with passed id does not exist', () => {
        spyOn(service, 'getAllActivity').and.callFake(() => window.localStorage.getItem('activity')!);

        const activity: Activity = {
            '1/14/2022': [{
                id: 'abcde',
                hour: '11:00:00 AM',
                intake: 400
            },
            {
                id: '900ff',
                hour: '4:23:30 PM',
                intake: 550
            }],
            '4/30/2022': [{ id: '5tytt', hour: '9:43:42 AM', intake: 100 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(() => service.deleteActivityById('efgh')).toThrow(new Error('Activity to delete not found'));
    })

    // addReminder tests
    it('#addReminder should add reminder to localStorage', () => {
        service.addReminder(30);

        expect(window.localStorage.getItem('reminder')).toBe('30');
        expect(Number(window.localStorage.getItem('reminder')!)).toBeGreaterThanOrEqual(0);
        expect(Number(window.localStorage.getItem('reminder')!)).toBeLessThanOrEqual(1440);
        expect(window.localStorage.getItem('reminder')).toBeTruthy();
    })

    it('#addReminder should throw error if reminder is negative', () => {
        expect(() => service.addReminder(-1)).toThrow(new Error('Received reminder is invalid'));
    })

    it('#addReminder should throw error if reminder is greater than 1440', () => {
        expect(() => service.addReminder(1441)).toThrow(new Error('Received reminder is invalid'));
    })

    it('#addReminder should throw error if reminder is decimal', () => {
        expect(() => service.addReminder(60.5)).toThrow(new Error('Received reminder is invalid'));
    })

    it('#addReminder should override reminder in localStorage', () => {
        service.addReminder(30);
        service.addReminder(60);

        expect(window.localStorage.getItem('reminder')).toBe('60');
        expect(Number(window.localStorage.getItem('reminder')!)).toBeGreaterThanOrEqual(0);
        expect(Number(window.localStorage.getItem('reminder')!)).toBeLessThanOrEqual(1440);
        expect(window.localStorage.getItem('reminder')).toBeTruthy();
    })
})