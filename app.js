'use strict';
const express = require('express');
const exphb = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const WaiterApp = require('./js/waiterApp');

const app = express();
const waiterApp = WaiterApp();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', exphb({
    defaultLayout: 'main',
    helpers: {
        'checkedDay': function () {
            if (this.checked)
                return 'checked';
        },
        'rowStyle': function () {
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

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }
}));

app.use(express.static('public'));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {

    res.render('home');
});

//sign-in route
app.post('/sign-in', async (req, res) => {
    let user = await waiterApp.getUser(req.body.username);
    if (user) {
        req.session.username = user;
        res.redirect('/waiter');
        return;
    }
    req.flash('error', 'Please enter a valid user');
    res.redirect('/');
});

app.post('/register', async (req, res) => {
    let result = await waiterApp.addUser(req.body);
    if (req.body.isAdmin === chec) { }

    let status = result ?
        result : 'user successfully added';
    res.render('home', { status });
});

app.get('/logout', function (req, res) {
    delete req.session.username;
    res.redirect('/');
});

app.get('/waiter', async (req, res, next) => {
    try {
        let user = req.session.username;
        if (!user) {
            res.redirect('/');
            return;
        }
        let context = {};
        if (await waiterApp.updateActiveUser(user)) {
            context.username = await waiterApp.getActiveUser;
            context.weekdays = await waiterApp.getWeekdays(user);
        }
        res.render('dashboard', context);
    } catch (err) {
        next(err);
    }
});

app.post('/waiter/assign-shifts', async (req, res, next) => {

    if (!req.session.username) {
        res.render('dashboard');
        return;
    }

    let wd = Array.isArray(req.body.checkedWeekdays) ?
        req.body.checkedWeekdays : new Array(req.body.checkedWeekdays);

    let message = ""

    try {
        if (wd[0]) {
            await waiterApp.registerShift({
                username: req.session.username,
                weekdays: wd
            });
            message = "shifts successfully added!"
        }
        req.flash('info', 'Shift(s) successfully added!');
        res.redirect('/waiter/' + req.params.username);
    } catch (err) {
        next(err);
    }
});

app.get('/waiter/:whatever', (req, res) => {
    res.redirect('/waiter')
})

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

