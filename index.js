const express = require('express')
const {con, auth} = require('./config.js')
const {encrypt, match} = require('./encrypt.js')
const sendOTP = require('./mail.js')

var bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT || 3000;
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(PORT, () => {
    console.log("Listening to port " + PORT);
})

app.post('/operator', (req, res) => {
    
    console.log(req.body);
    
    const name = req.body.name
    const password = req.body.password
    const sql = `Select * from operator where name="${name}";`
    con.query(sql, function (err, result) {
        if (err) throw( err);

        console.log("Result: " + JSON.stringify(result));
        if(typeof( result[0]) === 'undefined') {
            res.status(404).json({message: "Username is incorrect"})
        } else if(match(password, result[0]['password'])) {
            res.status(200).json({message: "Welcome " + result[0]["name"]})
        } else {
            res.status(404).json({message: "Password is incorrect"})
        }
    });
})

app.post('/addOperator', (req, res) => {
    
    console.log(req.body.name);
    
    const name = req.body.name
    const email = req.body.email
    const password = encrypt(req.body.password)
    const sql = `insert into operator values ("${name}", "${email}" ,"${password}");`
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.status(200).json({message: `${result.affectedRows} operator addded`})
    });
})

app.post('/sendotp', async (req, res) => {
    const otp = Math.floor(1000 + Math.random() * 9000)
    const email = req.body.email
    
    const sql = `Select * from operator where email="${email}";`
    con.query(sql, async function (err, result) {
        if (err) throw( err);

        // console.log("Result: " + JSON.stringify(result));
        if(typeof( result[0]) === 'undefined') {
            res.status(404).json({message: "Incorrect email"})
        }  else {
            const result = await sendOTP(email, otp)
            // console.log(result);
            if (result === "Success") {
                // console.log("Success");
                const query = `insert into otp(email, otp) values ("${email}", "${otp}");`
                
                con.query(query , function (err, resu) {
                    if (err) throw err;
                    if(typeof( result[0]) === 'undefined') {
                        console.log("OTP not added to db");
                        res.status(200).json({message: `${resu.affectedRows} otp not addded but sent succesfully`})
                    }
                    res.status(200).json({message: `${resu.affectedRows} otp addded and sent succesfully`})
                });
                // res.status(200).json({message: "OTP sent succesfully"})
            } else {
                res.status(200).json({message: result})
            }
        }
    });    
})