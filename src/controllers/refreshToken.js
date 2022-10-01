const jwt = require("jsonwebtoken");
const { con, auth } = require("../config/dbconfig");
const handleRefresh = (req, res) => {

  //if cookies
//   const cookies = req.cookies;
//   if (!cookies?.jwt)
//     return res
//       .status(401)
//       .json({ message: "please login to set refresh token as cookie" });
//   const refreshToken = cookies.jwt;
    const refreshToken = req.body.refreshToken
    
  //check if refresh token is valid(in db)
  const sql = `Select * from refreshtoken where refreshToken="${refreshToken}";`;
  con.query(sql, async (err, result) => {
    if (err) throw err;

    if (result.length) {
      // evaluate jwt
      try {
        const data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign(
          { username: data.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );
        res.status(200).json({ accessToken });
      } catch (error) {
        res
          .status(401)
          .send({ error: "Please authenticate using a valid token" });
      }
    } else {
      return res.status(403).json({ message: "No user found" });
    }
  });
};

module.exports = { handleRefresh }
