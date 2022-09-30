const jwt = require('jsonwebtoken')

const authAdmin = (req, res, next) => {
    //get uesr from jwt token
    const token = req.header('auth-token')
    if(!token) {
        res.status(401).send({message: "Please add token"})
    } 
    try {
        const data = jwt.verify(token, "qwertyuiop0987654321")
        req.user = data.user
        next()
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
}

module.exports = authAdmin