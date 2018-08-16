const assert = require('assert');
const WaiterApp = require('../js/waiterApp');

// add user tests
describe ("Tests the user functions", () =>{
    const waiterInstance = WaiterApp('waiter_availability_test');

    beforeEach(async () => await waiterInstance.reset());
    it("tests that function adds a user", async () => {
        let user = {
            username: 'Tranquil',
            full_name: 'Tranquil Vibes',
            position: 'Waiter'
        }
        await waiterInstance.addUser(user);
        assert.deepEqual(await waiterInstance.users(), [{username: 'Tranquil', position:'Waiter'}]);
    });
    
    it("tests id add user restricts duplicate entries", async () => {
        let user = {
            username: 'Tranquil',
            full_name: 'Tranquil Vibes',
            position: 'Waiter'
        }
        assert.deepEqual(await waiterInstance.addUser(user), 'user exists');
    });

    after(async () => await waiterInstance.stopQuery());
});

// get shifts tests
describe ("Tests the shifts functions", () =>{
    const waiterInstance = WaiterApp('waiter_availability_test');

    beforeEach(async () => await waiterInstance.reset());
    it("tests that the function adds and returns the shifts", async () => {
        const shifts = {
            username: 'Tranquil',
            weekdays: ['Monday', 'Wednesday', 'Friday']
        };
        await waiterInstance.registerShift(shifts);
        assert.deepEqual(await waiterInstance.getShifts(), 
        [
            {username: 'Tranquil', weekday: 'Monday'},
            {username: 'Tranquil', weekday: 'Wednesday'},
            {username: 'Tranquil', weekday: 'Friday'}
        ]);
    });

    after(async () => await waiterInstance.stopQuery());
});

// weekdays tests
describe ("Tests the weekdays functions", () =>{
    const waiterInstance = WaiterApp('waiter_availability_test');

    beforeEach(async () => await waiterInstance.reset());
    it("tests that the function gets all weekdays", async () => {
        
        assert.deepEqual(await waiterInstance.getWeekdays(),
            [
                {id: 1, day_name: 'Monday'},
                {id: 2, day_name: 'Tuesday'},
                {id: 3, day_name: 'Wednesday'},
                {id: 4, day_name: 'Thursday'},
                {id: 5, day_name: 'Friday'},
                {id: 6, day_name: 'Saturday'},
                {id: 7, day_name: 'Sunday'},
            ]
        );
    });

    it("tests that the function gets all weekdays with checked days for specified user", async () => {
        const shifts = {
            username: 'Tranquil',
            weekdays: ['Monday', 'Wednesday', 'Friday']
        };
        await waiterInstance.registerShift(shifts);
        assert.deepEqual(await waiterInstance.getWeekdays('Tranquil'),
            [
                {id: 1, day_name: 'Monday', checked: true},
                {id: 2, day_name: 'Tuesday'},
                {id: 3, day_name: 'Wednesday', checked: true},
                {id: 4, day_name: 'Thursday'},
                {id: 5, day_name: 'Friday', checked: true},
                {id: 6, day_name: 'Saturday'},
                {id: 7, day_name: 'Sunday'},
            ]
        );
    });

    after(async () => await waiterInstance.stopQuery());
});

describe('tests the user update functions', () => {
    const waiterInstance = WaiterApp('waiter_availability_test');

    beforeEach(async () => await waiterInstance.reset());
    it("tests that the function updates the active user", async () => {
        ;
        assert.deepEqual(await waiterInstance.updateActiveUser('Tranquil'), true);
    });

    it("tests that the function fails to update active user if user is not registered", async () => {
        ;
        assert.deepEqual(await waiterInstance.updateActiveUser('Umkhowudi'), false);
    });

    after(async () => await waiterInstance.stopQuery())
})


