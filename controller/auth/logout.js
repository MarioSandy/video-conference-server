const pool = require("../../config/db");

async function queryCheckRefreshToken(client, refreshToken) {
  const queryResult = await client.query(
    `
        SELECT refresh_token
        FROM user_token
        WHERE refresh_token = ?
    `,
    [refreshToken].filter((i) => i !== "undefined")
  );
  return queryResult.rows[0].refresh_token;
}

async function queryDeleteRefreshToken(client, refreshToken) {
  const queryResult = await client.query(
    `
        UPDATE user_token 
        SET refresh_token = null
        WHERE user_id = ?
    `,
    [refreshToken].filter((i) => i !== "undefined")
  );
  return queryResult.rows[0];
}

async function logout(req, res, next) {
  const client = await pool.connect();
  try {
    // On client also delete the access token
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;
    await client.query("BEGIN");

    // Check user's refresh token in DB
    const refreshTokenFound = await queryCheckRefreshToken(
      client,
      refreshToken
    );
    if (refreshTokenFound.length) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204);
    }

    // Delete refreshToken in DB
    const loggedOutUser = await queryDeleteRefreshToken(client, refreshToken);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); // secure: true - only serves on https on production
    await client.query("COMMIT");
    return res.sendStatus(204);
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}

module.exports = logout;
