'use strict';
const express = require('express');
const exphb = require('express-handlebars');
const bodyParser = require('body-parser');
const WaiterApp = require('./js/waiterApp');

const app = express();
const waiterApp = WaiterApp();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', exphb({
    defaultLayout: 'main',
    helpers:{
        'waitersOnDuty': function() {
            let output = '';
            for (let waiter of this.waiters) {
                output += (waiter + " - ");
            }
            return output;
        },
        'rowStyle': function() {
            if (this.waiters.length > 3)
                return 'bgRed';
            else if (this.waiters.length === 3)
                return 'bgGreen';
            else
                return 'bgBlue';
        }
    }
}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

//sign-in route
app.post('/sign-in', (req, res) => {
    res.redirect('/waiter/' + req.body.username);
});

app.post('/register', async (req, res) => {
    let result = await waiterApp.addUser(req.body);
    let status = result ?
        result : 'user successfully added';
    res.render('home', { status });
})

app.get('/waiter/not-found', (req, res) => {
    res.render('dashboard');
});

app.get('/waiter/:username', async (req, res, next) => {
    try {
        let user = req.params.username;
        let context = {};
        if (await waiterApp.updateActiveUser(user)) {
            context.username = await waiterApp.getActiveUser;
            context.weekdays = await waiterApp.getWeekdays();
        }
        res.render('dashboard', context);
    } catch (err) {
        next(err);
    }
});

app.post('/waiter/:username/assign-shifts', async (req, res, next) => {
    let wd = Array.isArray(req.body.checkedWeekdays)?
        req.body.checkedWeekdays : new Array(req.body.checkedWeekdays);
    console.log(wd);

    if (!wd[0]) {
        res.redirect('/waiter/' + req.params.username)
    }

    try {
        await waiterApp.registerShift({
            username: req.params.username,
            weekdays: wd
        });
        res.redirect('/days');
    } catch (err) {
        next(err);
    }
});

app.get('/days', async (req, res, next) => {
    try {
        let context = {
            shifts: await waiterApp.orderByDay(),
            username: await waiterApp.getActiveUser()
        }
        res.render('shifts', context);
    } catch (err) {
        next(err);
    }
})

// Serve app on port 3000
app.listen(PORT, () => console.log('Server started on port', PORT));

