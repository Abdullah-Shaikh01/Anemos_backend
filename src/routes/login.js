const express = require("express");
const jwt = require("jsonwebtoken");
const { con, auth } = require("../config/dbconfig");
const { encrypt, match } = require("../util/encrypt.js");
const refreshToken = require("../controllers/refreshToken");
const router = express.Router();

router.post("/", (req, res) => {
  // console.log("Hello");
  const { username, password } = req.body;
  console.log(req.body);
  console.log(username);
  console.log(password);
  // const password = req.body.password
  const sql = `Select * from users where username="${username}";`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res
        .status(400)
        .json({ message: "Please try to login with correct credentials" });
    } else if (match(password, result[0]["password"])) {
      //create JWTs
      const accessToken = jwt.sign(
        { username: username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      const refreshToken = jwt.sign(
        { username: username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      //Save refresh token in db
      //if token already present then update
      const sql = `Select * from refreshtoken where username="${username}";`;
      con.query(sql, async (err, result) => {
        if (err) throw err;

        if (result.length) {
          //update refresh token
          const query = `UPDATE refreshtoken SET refreshToken='${refreshToken}' WHERE username='${username}';`;
          con.query(query, function (err, result) {
            if (err) throw err;

            if (!result.affectedRows) {
              console.log("Refresh token not update in DB");
              res
                .status(200)
                .json({
                  message: `${result.affectedRows} Refresh token not update in DB`,
                });
            }
            //save token as cookie
            // res.cookie("jwt", refreshToken, {
            //   httpOnly: true,
            //   sameSite: "None",
            //   maxAge: 24 * 60 * 60 * 1000,
            // }); //add {secure: true, } for chrome
            res
              .status(200)
              .json({ message: "welcome " + username, accessToken, refreshToken });
          });
        } else {
          //else insert new
          const query = `insert into refreshtoken values ('${username}', '${refreshToken}');`;
          con.query(query, function (err, result) {
            if (err) throw err;

            if (!result.affectedRows) {
              console.log("Refresh token not added to DB");
              res
                .status(200)
                .json({
                  message: `${result.affectedRows} Refresh token not added to DB`,
                });
            }
            //save token as cookie
            // res.cookie("jwt", refreshToken, {
            //   httpOnly: true,
            //   sameSite: "None",
            //   maxAge: 24 * 60 * 60 * 1000,
            // }); //add {secure: true, } for chrome
            res
              .status(200)
              .json({ message: "Welcome " + username, accessToken, refreshToken });
          });
        }
      });
    } else {
      res
        .status(404)
        .json({ message: "Please try to login with correct credentials" });
    }
  });
});

router.post("/refresh", refreshToken.handleRefresh);

module.exports = router;
