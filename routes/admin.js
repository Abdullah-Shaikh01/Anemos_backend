const express = require('express')
const {con, auth} = require('../config/dbconfig')
const {encrypt, match} = require('../util/encrypt.js')
const verifyJWT = require('../middleware/verifyToken')

const router = express.Router()

router.post('/addOperator', verifyJWT, (req, res) => {    
    
    const {name, email} = req.body
    const password = encrypt(req.body.password)
    const sql = `insert into users values ("${name}", "${email}" ,"${password}");`
    con.query(sql, (err, result) => {
        if (err) {
            console.log("Error while adding")
            res.status(404).json({message: "Looks like email is already taken"})
            throw err
        } else {
            res.status(200).json({message: `${result.affectedRows} operator addded`})
        }
    })
})

module.exports = router