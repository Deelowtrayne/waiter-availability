const dbconx = require('../config/db_connection');
const chalk = require('chalk');

module.exports = function(dbname="waiter_availability") {
    const pool = dbconx(dbname);

    var activeUser = '';

    async function resetData(){
        try{
            await pool.query('truncate table shifts');
            console.log(chalk.green('Database tables emptied successfully'));
        } catch (err) {
            console.log(chalk.bgRed.white('Database reset failed'));
        }
    }

    async function addWaiter(waiter) {
        const found = await pool.query(`select id from users where username='${waiter.username}' limit 1`);
        if (found.rowCount > 0){
            console.log(chalk.bgRed.white('Username taken'));
            return 'user exists';
        }
        if (!waiter.position)
            waiter.position = 'waiter';
        await pool.query(`insert into users(username, full_name, position) values ('${waiter.username}', '${waiter.full_name}', '${waiter.position}')`);
    }

    async function getAllUsers() {
        const results = await pool.query(`select username, position from users`);
        return results.rows;
    }

    async function registerShift(shift) {
        const days = shift.weekdays;
        const found = await pool.query('select id from users where username=$1', [shift.username]);
        const userId = found.rows[0].id;

        // {
        //     username: "deelow",
        //     weekdays: []
        // }

        for(let day of days){
            try {
                let dayId = await pool.query('select id from weekdays where day_name=$1', [day]);
                await pool.query('insert into shifts(user_id, weekday_id) values ($1, $2)', [userId, dayId.rows[0].id]);
            } catch (err) {
                console.log(chalk.bgRed.white('Could not register for ' + day));
            }
        }
    }

    async function getShifts() {
        let res = await pool.query('select user_id, weekday_id from shifts order by weekday_id');
        let results = res.rows;
        var shiftData = [];

        for(let row of results){
            var user = await pool.query(
                'select username from users where id=$1 limit 1', 
                [row.user_id]
            );
            let weekday = await pool.query(
                'select day_name from weekdays where id=$1 limit 1',
                [row.weekday_id]
            );
            shiftData.push({
                username: user.rows[0].username, 
                weekday: weekday.rows[0].day_name
            });
        };
        return shiftData; 
    }

    async function orderByDay(){
        let shifts = await getShifts();
        let shiftData = [];

        for (let shift of shifts){
            let shiftForDay = shiftData.find((currentShift) => {
                return shift.weekday === currentShift.weekday;
            });

            if (shiftForDay) {
                shiftForDay.waiters.push(shift.username);
            } else {
                shiftData.push({
                    weekday : shift.weekday,
                    waiters : [shift.username]
                });
            }
        }
        return shiftData;
    }
    async function clearShifts(){
        try {
            await pool.query('select * from weekdays');
        } catch(err) {
            console.log(chalk.bgRed.white('Could not clear shifts'));
        }
    }

    async function updateActiveUser(value) {
        let found = await pool.query('select username from users where username=$1', [value]);
        if (found.rowCount > 0) {
            activeUser = found.rows[0].username;
            return true;
        }
        return false
    }

    async function getWeekdays(username) {
        let weekdays = await pool.query('select * from weekdays');
        let days = weekdays.rows;

        if (username) {
            let foundDays = await pool.query('SELECT day_name FROM shifts JOIN users ON users.id = shifts.user_id JOIN weekdays ON weekdays.id = shifts.weekday_id WHERE username=$1', [username]);
            for (let i=0; i < days.length; i++) {
                for(let current of foundDays.rows) {
                    if (days[i].day_name === current.day_name){
                        days[i].checked = true;
                    }
                    console.log(days[i]);
                    
                }
            }
        }
        return days;
    }

    async function stopQuery(){
        await pool.end();
    }

    function getActiveUser(){
        return activeUser;
    }
    
    return {
        reset: resetData,
        addUser: addWaiter,
        users: getAllUsers,
        clear: clearShifts,
        updateActiveUser,
        getShifts, 
        registerShift,
        getWeekdays,
        orderByDay,
        getActiveUser,
        stopQuery
    }
}