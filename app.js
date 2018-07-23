const express =  require('express');
const exphb = require('express-handlebars');
const bodyParser = require('body-parser');


const app = express();
const PORT = process.env.PORT || 3000;

let useSSL = false;
if (process.env.DATABASE_URL){
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/waiter_availability';

const pg = require('pg');
const Pool = pg.Pool;

const pool = new Pool({ 
    connectionString,
    ssl: useSSL
});

app.engine('handlebars', exphb({
    defaultLayout: 'main',
    helpers:{}
}))
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('home');
})

// Serve app on port 3000
app.listen(PORT, () => console.log('Server started on port', PORT));

