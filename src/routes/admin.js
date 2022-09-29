const express = require('express')
const {con, auth} = require('../config/dbconfig')
const {encrypt, match} = require('../util/encrypt.js')
const authAdmin = require('../middleware/Admin')

const router = express.Router()

router.post('/addOperator', authAdmin, (req, res) => {    
    
    const name = req.body.name
    const email = req.body.email
    const password = encrypt(req.body.password)
    const sql = `insert into operator values ("${name}", "${email}" ,"${password}");`
    con.query(sql, (err, result) => {
        if (err) {
            console.log("Error while adding")
            res.status(404).json({message: "Looks like email is already taken"})
            // throw err
        } else {
            res.status(200).json({message: `${result.affectedRows} operator addded`})
        }
    })
})

module.exports = router