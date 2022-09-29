const {con, auth} = require('../config/dbconfig')

module.exports = async function deleteOTP (email)  {
    con.query(`DELETE FROM otp WHERE email = '${email}'`, (err, result) => {
        if (err) throw( err);
        // else console.log(result);
    })
}