const express = require('express')
const logout = require('../controllers/logout')
const verifyJWT = require('../middleware/verifyToken')  //maybe add this later


const router = express.Router()
router.post('/', logout.handleLogout)

module.exports = router