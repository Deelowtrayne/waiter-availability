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
        'formattedShifts': function() {
            let output = '';
            weekdays
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

app.get('/waiter/:username', async (req, res, next) =>{
    try {
        let context = {
            username: req.params.username,
            weekdays: await waiterApp.getWeekdays()
        }
        res.render('dashboard', context);
    } catch (err) {
        next(err);
    }
});

app.post('/waiter/add-shifts/:username', async (req, res, next) =>{
    try {
        await waiterApp.registerShift({
            username: req.params.username,
            weekdays: req.body.checkedWeekdays
        });

        res.redirect('/days');

    } catch (err) {
        next(err);
    }
});

app.get('/days', async (req, res, next) => {
    res.render('shifts', {shifts: await waiterApp.getShifts()});
})

// Serve app on port 3000
app.listen(PORT, () => console.log('Server started on port', PORT));
