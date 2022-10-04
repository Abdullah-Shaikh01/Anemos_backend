const express = require('express')
const {con, auth} = require('../config/dbconfig')
const router = express.Router()
const mailOTP = require('../util/mailOTP.js')
const deleteOTP = require('../util/deleteOTP.js')

router.post('/sendotp', async (req, res) => {
    const otp = Math.floor(1000 + Math.random() * 9000)
    const email = req.body.email
    
    const sql = `Select * from users where email="${email}";`
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

                    const query = `INSERT INTO otp VALUES ("${email}", "${otp}", current_timestamp())`;
                
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
            res.status(404).json({message: "Please first request for OTP"})
        }  else {
            console.log(result);
            if(result[0]["time"].getTime() + 300000 >=  new Date()) {     //300000 = 5 minutes* 60 seconds * 1000 milisecond
                console.log("Not expired yet!")
                if(result[0]["otp"] == otp) {
                    console.log("Correct otp")
                    await deleteOTP(email)
                    res.status(200).json({message: "Correct OTP"})

                } else {
                    console.log("Incorrect otp")
                    // await deleteOTP(email)
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