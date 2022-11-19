const pool = require("../../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function queryCheckRefreshToken(refreshToken) {
  const queryResult = await pool.query(
    `
        SELECT "user".user_id,
               username,
               email,
               profile_picture
        FROM "user"
        JOIN user_token
            ON "user".user_id = user_token.user_id
        WHERE refresh_token = $1
    `,
    [refreshToken]
  );
  if (queryResult.rowCount === 0) {
    return null;
  }
  return queryResult.rows[0];
}

async function refreshToken(req, res) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    // Check user's refresh token in DB
    const loggedUser = await queryCheckRefreshToken(refreshToken);
    if (Object.keys(loggedUser).length < 1) return res.sendStatus(403); //Forbidden

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || loggedUser.email !== decoded.email)
          return res.sendStatus(403);
        // Create JWTs
        const accessToken = jwt.sign(
          {
            user_info: {
              user_id: loggedUser.user_id,
              nama_lengkap: loggedUser.nama_lengkap,
              email: loggedUser.email,
              profile_picture: loggedUser.profile_picture,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );
        res.json({
          access_token: accessToken,
          user_id: loggedUser.user_id,
          username: loggedUser.username,
          email: loggedUser.email,
          profile_picture: loggedUser.profile_picture,
        });
      }
    );
  } catch (err) {
    console.log(err);
    throw new Error(err);
    // next(err);
  }
}

module.exports = refreshToken;
