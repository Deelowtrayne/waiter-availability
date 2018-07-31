const pg = require('pg');

module.exports = function (dbname) {
    const connectionString = process.env.DATABASE_URL || 'postgresql://deelowtrayne:nomawonga@localhost:5432/' + dbname;
    const Pool = pg.Pool;

    let useSSL = false;
    if (process.env.DATABASE_URL) {
        useSSL = true;
    }

    const pool = new Pool({
        connectionString,
        ssl: useSSL
    });

    return pool;
}