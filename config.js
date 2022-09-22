const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});

//APP AUTHORIZATIOn
const auth = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = {con, auth}