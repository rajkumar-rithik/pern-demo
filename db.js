const Pool = require('pg').Pool;
require('dotenv/config');

const pool = new Pool({
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOSTNAME,
    port: process.env.PG_PORT
});

module.exports = pool;