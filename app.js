'use strict';
const express = require('express');
const exphb = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', exphb({
    defaultLayout: 'main',
    helpers:{}
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

app.get('/waiter/:username', async (req, res) =>{
    let context = {
        username: req.params.username
    }
    res.render('dashboard', context);
});

// Serve app on port 3000
app.listen(PORT, () => console.log('Server started on port', PORT));
