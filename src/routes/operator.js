const express = require('express')
const {con, auth} = require('../config/dbconfig')
const {encrypt, match} = require('../util/encrypt.js')
const mailOTP = require('../util/mailOTP.js')
const deleteOTP = require('../util/deleteOTP.js')
const router = express.Router()

router.post('/operator', (req, res) => {

    const name = req.body.name
    const password = req.body.password
    const sql = `Select * from operator where name="${name}";`
    con.query(sql, (err, result) => {
        if (err) throw( err)
        if(!result.length) {
            res.status(404).json({message: "Username is incorrect"})
        } else if(match(password, result[0]['password'])) {
            res.status(200).json({message: "Welcome " + result[0]["name"]})
        } else {
            res.status(404).json({message: "Password is incorrect"})
        }
    })
})

router.post('/addOperator', (req, res) => {    
    
    const name = req.body.name
    const email = req.body.email
    const password = encrypt(req.body.password)
    const sql = `insert into operator values ("${name}", "${email}" ,"${password}");`
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).json({message: `${result.affectedRows} operator addded`})
    })
})

router.post('/sendotp', async (req, res) => {
    const otp = Math.floor(1000 + Math.random() * 9000)
    const email = req.body.email
    
    const sql = `Select * from operator where email="${email}";`
    con.query(sql, async function (err, result) {
        if (err) throw( err);
        if(!result.length) {
            res.status(404).json({message: "Incorrect email"})
        }  else {
            const result = await mailOTP(email, otp)
            if (result === "Success") {
                const sql = `Select * from otp where email="${email}";`
                con.query(sql, async (err, result) => {
                    if (err) throw( err);

                    if(result.length) {
                       await deleteOTP(email);
                    }

                    const query = "INSERT INTO `otp` (`id`, `email`, `otp`, `time`) VALUES (NULL, '" + email+"', '"+ otp+"', current_timestamp())";
                
                    con.query(query , function (err, result) {
                         if (err) throw err
                         
                         if(!result.affectedRows) {
                             console.log("OTP not added to db");
                             res.status(200).json({message: `${result.affectedRows} otp not addded but sent succesfully`})
                         }
                         res.status(200).json({message: `${result.affectedRows} otp addded and sent succesfully`})
                     })
                })
            } else {
                res.status(200).json({message: result})
            }
        }
    })    
})

router.post('/verifyOTP', (req, res) => {
    const email = req.body.email
    const otp = req.body.otp
    const sql = `Select * from otp where email="${email}";`
    con.query(sql, async function (err, result) {
        if (err) throw( err);
        if(!result.length) {
            res.status(404).json({message: "Request for OTP"})
        }  else {
            if(result[0]["time"].getTime() + 300000 >=  new Date()) {     //300000 = 5 minutes* 60 seconds * 1000 milisecond
                console.log("Not expired yet!")
                if(result[0]["otp"] == otp) {
                    console.log("Correct otp")
                    await deleteOTP(email)
                    res.status(200).json({message: "Correct OTP"})

                } else {
                    console.log("Incorrect otp")
                    await deleteOTP(email)
                    res.status(404).json({message: "Incorrect OTP"})

                }
            } else {
                console.log("Expired");
                res.status(404).json({message: "Expired"})
            }
        }
    })
})

module.exports = router