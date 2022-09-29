const express = require('express')
const operator = require('./routes/operator')


const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Listening to port " + PORT)
})

app.use('/operator', operator)