const { con, auth } = require("../config/dbconfig");

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    //if cookies
    // const cookies = req.cookies;
    // if (!cookies?.jwt) return res.sendStatus(204); //No content
    // const refreshToken = cookies.jwt;
    const username = req.body.username

    // Is user in db?
    const sql = `Select * from refreshtoken where username="${username}";`
    con.query(sql, async (err, result) => {
        if (err) throw err;

        if (result.length) {
            // Delete user in db
            const query = `DELETE from refreshtoken WHERE username='${username}';`
          con.query(query, function (err, result) {
            if (err) throw err;

            if (!result.affectedRows) {
              console.log("Refresh token not deleted from DB");
              res
                .status(200)
                .json({
                  message: `${result.affectedRows} Refresh token not delted from DB`,
                })
            }
            //save token as cookie
            // res.cookie("jwt", refreshToken, {
            //   httpOnly: true,
            //   sameSite: "None",
            //   maxAge: 24 * 60 * 60 * 1000,
            // }); //add {secure: true, } for chrome
            res
              .status(200)
              .json({ message: "Deleted successfully" });
          });

            // if cookie
            // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            // console.log("ti");
            // res.status(204).json({})

        } else {
            // if cookie
            // if (!foundUser) {
            //     res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            //     return res.sendStatus(204);
            // }
            // else delete from client side too

            res.status(204).json({"message": "refresh token not in db but remove it from client side"})
        }
    })
}

module.exports = { handleLogout }