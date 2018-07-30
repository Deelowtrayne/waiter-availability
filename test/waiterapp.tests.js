const assert = require('assert');
const WaiterApp = require('../js/waiterApp');

describe ("Tests the add-user function", () =>{
    const waiterInstance = WaiterApp('waiter_availability_test');

    beforeEach(async () => await waiterInstance.reset());
    it("tests the ...", async () => {
        let user = {
            username: 'Tranquil',
            full_name: 'Tranquil Vibes',
            position: 'Waiter'
        }
        await waiterInstance.addUser(user);
        assert.deepEqual(await waiterInstance.users(), [{username: 'Tranquil', position:'Waiter'}]);
    });
    
    it("tests the ...", async () => {
        let user = {
            username: 'Tranquil',
            full_name: 'Tranquil Vibes',
            position: 'Waiter'
        }
        assert.deepEqual(await waiterInstance.addUser(user), 'user exists');
    });

    it("tests the ...", async () => {
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

