require('dotenv').config()
const express = require('express')
const login = require('./routes/login')
const logout = require('./routes/logout')
const operator = require('./routes/operator')
const admin = require('./routes/admin')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Listening to port " + PORT)
})

app.use('/login', login)
app.use('/logout', logout)
app.use('/operator', operator)
app.use('/admin', admin)