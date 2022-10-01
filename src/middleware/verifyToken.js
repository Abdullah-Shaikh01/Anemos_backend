const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    //get uesr from jwt token
    const token_header = req.header('Authorization')  || req.header('authorization')
    if(!token_header) {
        res.status(401).send({message: "Please add token"})
    } 
    try {
        const token = token_header.split(' ')[1]
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = data.username
        console.log(req.user);
        next()
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
}

module.exports = verifyJWT