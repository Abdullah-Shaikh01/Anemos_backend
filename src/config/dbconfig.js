const mysql = require('mysql');

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "test"
});

//APP AUTHORIZATIOn
const auth = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = {con, auth}