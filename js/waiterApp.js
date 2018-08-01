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
                console.log(chalk.bgRed.white(' Could not register for ' + day));
            }
        }
    }

    async function getShifts() {
        let res = await pool.query('select user_id, weekday_id from shifts');
        let results = res.rows;
        var shiftData = [];

        for(let row of results){
            var user = await pool.query('select username from users where id=$1 limit 1', [row.user_id])
            let weekday = await pool.query('select day_name from weekdays where id=$1 limit 1', [row.weekday_id]);
            shiftData.push({
                username: user.rows[0].username, 
                weekday: weekday.rows[0].day_name
            });
        };
        return shiftData; 
    }

    async function orderByDay(){
        let users = await getAllUsers();
        let shifts = await getShifts();
        let shiftData = [];

        for (let shift of shifts){
            let shiftForDay = shiftData.find((currentShift) => shift.weekday === currentShift.weekday )
            if (shiftForDay) {
                shiftForDay.waiters.push(shift.username);
            }
            else {
                shiftData.push({
                    weekday : shift.weekday,
                    waiters : [shift.username]
                });
            }
        }
        return shiftData;
    }

    async function updateActiveUser(value) {
        let found = await pool.query('select username from users where username=$1', [value]);
        if (found.rowCount > 0) {
            activeUser = found.rows[0].username;
            return true;
        }
        return false
    }

    async function getWeekdays() {
        let results = await pool.query('select * from weekdays');
        return results.rows;
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
        updateActiveUser,
        getShifts, 
        registerShift,
        getWeekdays,
        orderByDay,
        getActiveUser,
        stopQuery
    }
}