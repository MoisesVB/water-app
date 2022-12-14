import { Activity } from "../../shared/models/activity";
import { Constants } from "../constants";
import { Cup } from "../../shared/models/cup";
import { StoreLocalService } from "./store-local.service"
import { CupIcon } from "src/shared/models/cup-icon";

describe('StoreLocalService', () => {
    let service: StoreLocalService

    let localStore: { [key: string]: any };

    beforeEach(() => {
        service = new StoreLocalService();

        localStore = {};

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
    })

    it('#addGoal should return the added goal', () => {
        expect(service.addGoal(2000)).toBe(2000);
    })

    // getGoal tests
    it('#getGoal should return goal from localStorage', () => {
        window.localStorage.setItem('goal', '2000');

        expect(service.getGoal()).toBe(2000);
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
        spyOn(service, 'getIntake').and.callFake(() => Number(window.localStorage.getItem('intake')!));

        service.addIntake(400);

        expect(window.localStorage.getItem('intake')).toBe('400');
    })

    it('#addIntake should throw error if number is negative', () => {
        expect(() => service.addIntake(-1)).toThrow(new Error('To update intake is invalid'));
    })

    it('#addIntake should throw error if number is greater than MAX_WATER_TARGET', () => {
        expect(() => service.addIntake(Constants.MAX_WATER_TARGET + 1)).toThrow(new Error('To update intake is invalid'));
    })

    it('#addIntake should throw error if number is decimal', () => {
        expect(() => service.addIntake(324.44)).toThrow(new Error('To update intake is invalid'));
    })

    it('#addIntake should add intake two times (sum) in localStorage', () => {
        spyOn(service, 'getIntake').and.callFake(() => Number(window.localStorage.getItem('intake')!));

        service.addIntake(200);
        service.addIntake(200);

        expect(window.localStorage.getItem('intake')).toBe('400');
    })

    it('#addIntake should throw error if intake is added two times and the sum is greater than MAX_WATER_TARGET', () => {
        spyOn(service, 'getIntake').and.callFake(() => Number(window.localStorage.getItem('intake')!));

        expect(() => {
            const halfMax = Math.ceil(Constants.MAX_WATER_TARGET / 2);
            service.addIntake(halfMax);
            service.addIntake(halfMax + 1);
        }).toThrow(new Error('To update intake is invalid'));
    })

    it('#addIntake should return added intake', () => {
        spyOn(service, 'getIntake').and.callFake(() => Number(window.localStorage.getItem('intake')!));

        expect(service.addIntake(400)).toBe(400);
    })

    // getIntake tests
    it('#getIntake should return intake from localStorage', () => {
        window.localStorage.setItem('intake', '400');

        expect(service.getIntake()).toBe(400);
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
        spyOn(service, 'getIntake').and.callFake(() => Number(window.localStorage.getItem('intake')!));

        window.localStorage.setItem('intake', '500');
        service.deleteIntake(250);

        expect(window.localStorage.getItem('intake')).toBe('250');
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
        spyOn(service, 'getIntake').and.callFake(() => Number(window.localStorage.getItem('intake')!));

        window.localStorage.setItem('intake', '1500');
        service.deleteIntake(250);
        service.deleteIntake(100);

        expect(window.localStorage.getItem('intake')).toBe('1150');
    })

    it('#deleteIntake should throw error if intake is deleted two times and the subtraction is less than 0', () => {
        spyOn(service, 'getIntake').and.callFake(() => Number(window.localStorage.getItem('intake')!));
        window.localStorage.setItem('intake', '1000');

        expect(() => {
            const half = Math.ceil(Number(window.localStorage.getItem('intake')) / 2);

            service.deleteIntake(half);
            service.deleteIntake(half + 1);
        }).toThrow(new Error('Intake to delete is invalid'));
    })

    it('#deleteIntake should return the new intake', () => {
        spyOn(service, 'getIntake').and.callFake(() => Number(window.localStorage.getItem('intake')!));

        window.localStorage.setItem('intake', '800');

        expect(service.deleteIntake(200)).toBe(600);
    })

    // addActivity tests
    it('#addActivity should add activity to localStorage', () => {
        spyOn(service, 'getAllActivity').and.callFake(() => JSON.parse(window.localStorage.getItem('activity')!));

        service.addActivity(230);

        const date = new Date().toLocaleDateString(); // today date
        const obj = JSON.parse(window.localStorage.getItem('activity')!);
        const todayObj = obj[`${date}`][0];

        expect(todayObj.id).toBeTruthy();
        expect(todayObj.hour).toBeTruthy();

        expect(todayObj.intake).toBe(230);
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
        spyOn(service, 'getAllActivity').and.callFake(() => JSON.parse(window.localStorage.getItem('activity')!));

        service.addActivity(230);
        service.addActivity(500);

        const date = new Date().toLocaleDateString(); // today date
        const obj = JSON.parse(window.localStorage.getItem('activity')!);
        const todayObj = obj[`${date}`];

        expect(todayObj).toBeTruthy();
        expect(todayObj.length).toBe(2);
    })

    it('#addActivity should return activity', () => {
        spyOn(service, 'getAllActivity').and.callFake(() => JSON.parse(window.localStorage.getItem('activity')!));

        expect(service.addActivity(230).id).toBeTruthy();
        expect(service.addActivity(230).hour).toBeTruthy();
        expect(service.addActivity(230).intake).toBe(230);
    })

    // getAllActivity tests
    it('#getAllActivity should return activity from localStorage', () => {
        const activity: Activity = {
            '1/14/2022': [{ id: 'abcde', hour: '11:00:00 AM', intake: 400 }]
        }

        window.localStorage.setItem('activity', JSON.stringify(activity));

        expect(service.getAllActivity()).toBeTruthy();
        expect(Object.keys(service.getAllActivity()).length).toBe(1); // check length of date keys
        expect(service.getAllActivity()['1/14/2022'].length).toBe(1); // check length of array inside date key
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
        spyOn(service, 'getAllActivity').and.callFake(() => JSON.parse(window.localStorage.getItem('activity')!));

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
        spyOn(service, 'getAllActivity').and.callFake(() => JSON.parse(window.localStorage.getItem('activity')!));

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

    it('#deleteActivityById should return deleted activity', () => {
        spyOn(service, 'getAllActivity').and.callFake(() => JSON.parse(window.localStorage.getItem('activity')!));

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

        expect(service.deleteActivityById('900ff')).toEqual({ id: '900ff', hour: '4:23:30 PM', intake: 550 })
    })

    // addReminder tests
    it('#addReminder should add reminder to localStorage', () => {
        service.addReminder(30);

        expect(window.localStorage.getItem('reminder')).toBe('30');
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
    })

    it('#addReminder should return reminder', () => {
        expect(service.addReminder(40)).toBe(40);
    })

    // getReminder tests
    it('#getReminder should return reminder from localStorage', () => {
        window.localStorage.setItem('reminder', '60');

        expect(service.getReminder()).toBe(60);
    })

    it('#getReminder should throw error if reminder is negative', () => {
        window.localStorage.setItem('reminder', '-10');

        expect(() => service.getReminder()).toThrow(new Error('Reminder is invalid'));
    })

    it('#getReminder should throw error if reminder is greater than 1440', () => {
        window.localStorage.setItem('reminder', '1441');

        expect(() => service.getReminder()).toThrow(new Error('Reminder is invalid'));
    })

    it('#getReminder should throw error if reminder is decimal', () => {
        window.localStorage.setItem('reminder', '25.50');

        expect(() => service.getReminder()).toThrow(new Error('Reminder is invalid'));
    })

    it('#getReminder should throw error if reminder is not compatible with a number', () => {
        window.localStorage.setItem('reminder', 'abc-123');

        expect(() => service.getReminder()).toThrow(new Error('Reminder is invalid'));
    })

    it('#getReminder should throw error if reminder in localStorage is empty', () => {
        window.localStorage.setItem('reminder', '');

        expect(() => service.getReminder()).toThrow(new Error('Reminder is invalid'));
    })

    it('#getReminder should throw error if there is no reminder key in localStorage', () => {
        expect(() => service.getReminder()).toThrow(new Error('Reminder is invalid'));
    })

    // addCurrentDay tests
    it('#addCurrentDay should add current day to localStorage', () => {
        const fixedDate = new Date(2022, 1, 15); // year, month, day
        jasmine.clock().install();
        jasmine.clock().mockDate(fixedDate);

        service.addCurrentDay();

        expect(window.localStorage.getItem('currentDay')).toBe('15');

        jasmine.clock().uninstall();
    })

    it('#addCurrentDay should override current day in localStorage', () => {
        const fixedDate = new Date(2022, 1, 31);
        jasmine.clock().install();
        jasmine.clock().mockDate(fixedDate);

        const newDate = new Date(2022, 5, 4);
        jasmine.clock().mockDate(newDate);

        service.addCurrentDay();

        expect(window.localStorage.getItem('currentDay')).toBe('4');

        jasmine.clock().uninstall();
    })

    it('#addCurrentDay should return current day', () => {
        const fixedDate = new Date(2022, 1, 2); // year, month, day
        jasmine.clock().install();
        jasmine.clock().mockDate(fixedDate);

        expect(service.addCurrentDay()).toBe(2);

        jasmine.clock().uninstall();
    })

    // getCurrentDay tests
    it('#getCurrentDay should return current day from localStorage', () => {
        window.localStorage.setItem('currentDay', '23');

        expect(service.getCurrentDay()).toBe(23);
    })

    it('#getCurrentDay should throw error if current day is 0', () => {
        window.localStorage.setItem('currentDay', '0');

        expect(() => service.getCurrentDay()).toThrow(new Error('Date is invalid'));
    })

    it('#getCurrentDay should throw error if current day is negative', () => {
        window.localStorage.setItem('currentDay', '-4');

        expect(() => service.getCurrentDay()).toThrow(new Error('Date is invalid'));
    })

    it('#getCurrentDay should throw error if current day is greater than 31', () => {
        window.localStorage.setItem('currentDay', '32');

        expect(() => service.getCurrentDay()).toThrow(new Error('Date is invalid'));
    })

    it('#getCurrentDay should throw error if current day is decimal', () => {
        window.localStorage.setItem('currentDay', '7.5');

        expect(() => service.getCurrentDay()).toThrow(new Error('Date is invalid'));
    })

    it('#getCurrentDay should throw error if current day is not compatible with a number', () => {
        window.localStorage.setItem('currentDay', 'abc-123');

        expect(() => service.getCurrentDay()).toThrow(new Error('Date is invalid'));
    })

    it('#getCurrentDay should throw error if current day in localStorage is empty', () => {
        window.localStorage.setItem('currentDay', '');

        expect(() => service.getCurrentDay()).toThrow(new Error('Date is invalid'));
    })

    it('#getCurrentDay should throw error if there is no current day key in localStorage', () => {
        expect(() => service.getCurrentDay()).toThrow(new Error('Date is invalid'));
    })

    // addCup tests
    it('#addCup should add cup to localStorage', () => {
        spyOn(service, 'getAllCups').and.callFake(() => JSON.parse(window.localStorage.getItem('cups')!));

        service.addCup(350, true, CupIcon.Medium);

        const cups = JSON.parse(window.localStorage.getItem('cups')!);

        expect(cups).toBeTruthy();
        expect(cups.length).toBe(1);

        expect(cups[0].id).toBeTruthy();
        expect(cups[0].capacity).toBe(350);
        expect(cups[0].isCustom).toBeTrue();
        expect(cups[0].icon).toBeTruthy();
    })

    it('#addCup should throw error if capacity is 0', () => {
        expect(() => service.addCup(0, false, CupIcon.Small)).toThrow(new Error('Invalid cup values'));
    })

    it('#addCup should throw error if capacity is negative', () => {
        expect(() => service.addCup(-1, true, CupIcon.Large)).toThrow(new Error('Invalid cup values'));
    })

    it('#addCup should throw error if capacity is greater than MAX_WATER_TARGET', () => {
        expect(() => service.addCup(Constants.MAX_WATER_TARGET + 1, false, CupIcon.Large)).toThrow(new Error('Invalid cup values'));
    })

    it('#addCup should throw error if capacity is decimal', () => {
        expect(() => service.addCup(324.44, true, CupIcon.Large)).toThrow(new Error('Invalid cup values'));
    })

    it('#addCup should add cup two times in localStorage', () => {
        spyOn(service, 'getAllCups').and.callFake(() => JSON.parse(window.localStorage.getItem('cups')!));

        service.addCup(200, false, CupIcon.Medium);
        service.addCup(350, true, CupIcon.Medium);

        const cups = JSON.parse(window.localStorage.getItem('cups')!);

        expect(cups).toBeTruthy();
        expect(cups.length).toBe(2);
    })

    it('#addCup should return added cup', () => {
        spyOn(service, 'getAllCups').and.callFake(() => JSON.parse(window.localStorage.getItem('cups')!));

        expect(service.addCup(350, true, CupIcon.Medium)).toBeTruthy();
    })

    // getAllCups tests
    it('#getAllCups should return cups from localStorage', () => {
        const cups: Cup[] = [{ id: 'abcde', capacity: 550, isCustom: true, icon: CupIcon.Large }];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(service.getAllCups()).toBeTruthy();
        expect(service.getAllCups().length).toBe(1);
    })

    it('#getAllCups should throw error if capacity is 0', () => {
        const cups: Cup[] = [{ id: 'abcde', capacity: 0, isCustom: false, icon: CupIcon.Small }];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(() => service.getAllCups()).toThrow(new Error('Invalid cup found'));
    })

    it('#getAllCups should throw error if capacity is negative', () => {
        const cups: Cup[] = [{ id: 'abcde', capacity: -200, isCustom: false, icon: CupIcon.ExtraSmall }];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(() => service.getAllCups()).toThrow(new Error('Invalid cup found'));
    })

    it('#getAllCups should throw error if capacity is greater than MAX_WATER_TARGET', () => {
        const cups: Cup[] = [{ id: 'abcde', capacity: Constants.MAX_WATER_TARGET + 1, isCustom: true, icon: CupIcon.Large }];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(() => service.getAllCups()).toThrow(new Error('Invalid cup found'));
    })

    it('#getAllCups should throw error if capacity is decimal', () => {
        const cups: Cup[] = [{ id: 'abcde', capacity: 100.50, isCustom: true, icon: CupIcon.Small }];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(() => service.getAllCups()).toThrow(new Error('Invalid cup found'));
    })

    it('#getAllCups should throw error if capacity is not compatible with a number', () => {
        const cups = [{ id: 'abcde', capacity: 'abfg', isCustom: true, icon: CupIcon.Large }];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(() => service.getAllCups()).toThrow(new Error('Invalid cup found'));
    })

    it('#getAllCups should throw error if cups in localStorage is empty', () => {
        window.localStorage.setItem('cups', '');

        expect(() => service.getAllCups()).toThrow(new Error('Error parsing cups'));
    })

    it('#getAllCups should throw error if there is no cups key in localStorage', () => {
        expect(() => service.getAllCups()).toThrow(new Error('Cups is falsy'));
    })

    it('#getAllCups should throw error if id is a number', () => {
        const cups = [{ id: 12344, capacity: 500, isCustom: false, icon: CupIcon.Large }];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(() => service.getAllCups()).toThrow(new Error('Invalid cup found'));
    })

    it('#getAllCups should throw error if id is falsy', () => {
        const cups = [{ id: null, capacity: 450, isCustom: true, icon: CupIcon.Small }];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(() => service.getAllCups()).toThrow(new Error('Invalid cup found'));
    })

    it('#getAllCups should throw error if isCustom is a number', () => {
        const cups = [{ id: 'abcde', capacity: 650, isCustom: 12345, icon: CupIcon.Small }];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(() => service.getAllCups()).toThrow(new Error('Invalid cup found'));
    })

    it('#getAllCups should throw error if isCustom is falsy', () => {
        const cups = [{ id: 'rtyre', capacity: 200, isCustom: null, icon: CupIcon.Small }];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(() => service.getAllCups()).toThrow(new Error('Invalid cup found'));
    })

    it('#getAllCups should throw error if icon is falsy', () => {
        const cups = [{ id: 'qewrt', capacity: 900, isCustom: true, icon: null }];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(() => service.getAllCups()).toThrow(new Error('Invalid cup found'));
    })

    it('#getAllCups should throw error if icon is not a CupIcon type', () => {
        const cups = [{ id: 'qewrt', capacity: 900, isCustom: true, icon: 'Different' }];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(() => service.getAllCups()).toThrow(new Error('Invalid cup found'));
    })

    // deleteCupById tests
    it('#deleteCupById should delete cup of localStorage', () => {
        spyOn(service, 'getAllCups').and.callFake(() => JSON.parse(window.localStorage.getItem('cups')!));

        const cups: Cup[] = [
            { id: 'qwert', capacity: 200, isCustom: false, icon: CupIcon.Medium },
            { id: 'abcde', capacity: 350, isCustom: true, icon: CupIcon.Large }
        ];

        window.localStorage.setItem('cups', JSON.stringify(cups));
        service.deleteCupById('abcde');

        expect(JSON.parse(window.localStorage.getItem('cups')!).length).toBe(1);
        expect(JSON.parse(window.localStorage.getItem('cups')!)[1]).toBeUndefined();
    })

    it('#deleteCupById should throw error if id is invalid', () => {
        expect(() => service.deleteCupById('')).toThrow(new Error('Id is invalid'));
    })

    it('#deleteCupById should throw error if activity with passed id does not exist', () => {
        spyOn(service, 'getAllCups').and.callFake(() => JSON.parse(window.localStorage.getItem('cups')!));

        const cups: Cup[] = [
            { id: 'qwert', capacity: 200, isCustom: false, icon: CupIcon.Large },
            { id: 'abcde', capacity: 350, isCustom: true, icon: CupIcon.Large }
        ];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(() => service.deleteCupById('efgh')).toThrow(new Error('Cup to delete not found'));
    })

    it('#deleteCupById should return delete cup', () => {
        spyOn(service, 'getAllCups').and.callFake(() => JSON.parse(window.localStorage.getItem('cups')!));

        const cups: Cup[] = [
            { id: 'qwert', capacity: 200, isCustom: false, icon: CupIcon.Large },
            { id: 'abcde', capacity: 350, isCustom: true, icon: CupIcon.Large }
        ];

        window.localStorage.setItem('cups', JSON.stringify(cups));

        expect(service.deleteCupById('abcde')).toEqual({ id: 'abcde', capacity: 350, isCustom: true, icon: CupIcon.Large });
    })

    // deleteAllData tests
    it('#deleteAllData should delete localStorage data', () => {
        window.localStorage.setItem('goal', '2000');
        window.localStorage.setItem('intake', '1800');

        service.deleteAllData();

        expect(Object.keys(localStore).length).toBe(0);
    })

    it('#deleteAllData should throw error if localStorage is empty', () => {
        expect(() => service.deleteAllData()).toThrow(new Error('LocalStorage is empty'));
    })

    it('#deleteAllData should delete localStorage data and data added after deletion will be stored on localStorage', () => {
        window.localStorage.setItem('goal', '2000');
        window.localStorage.setItem('reminder', '60');

        service.deleteAllData();

        window.localStorage.setItem('intake', '1000');

        expect(Object.keys(localStore).length).toBe(1);
    })

    it('#deleteAllData should return true after deletion', () => {
        window.localStorage.setItem('goal', '2000');
        window.localStorage.setItem('intake', '1800');

        expect(service.deleteAllData()).toBeTrue();
    })
})