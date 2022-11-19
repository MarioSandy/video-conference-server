const jwt = require("jsonwebtoken");
require("dotenv").config();

const pool = require("../../config/db");
const { validateParameterString } = require("../../functions/validate");

function validateInputs(body) {
  if (
    validateParameterString(body.email) === false ||
    validateParameterString(body.password) === false
  ) {
    throw Error("Input invalid!");
  } else {
    return body;
  }
}

async function queryLogin(inputs) {
  const queryResult = await pool.query(
    `
            SELECT "user".user_id,
                   "user".username,
                   "user".email,
                   "user".password,
                   "user".profile_picture
            FROM "user"
            WHERE "user".email = $1
            AND "user".password = crypt($2, "user".password)
            GROUP BY "user".user_id,
                     "user".username,
                     "user".email,
                     "user".password
        `,
    [inputs.email, inputs.password]
  );
  if (queryResult.rowCount === 0) {
    return null;
  }
  return queryResult.rows[0];
}

async function queryUpdateRefreshToken(userId, refreshToken) {
  const queryResult = await pool.query(
    `
            INSERT INTO user_token (user_id, refresh_token)
            VALUES($1, $2)
                ON CONFLICT(user_id)
            DO 
            UPDATE SET refresh_token = EXCLUDED.refresh_token
            RETURNING refresh_token
        `,
    [userId, refreshToken]
  );
  if (queryResult.rowCount === 0) {
    return null;
  }
  return queryResult.rows[0].refresh_token;
}

async function login(req, res) {
  const client = await pool.connect();
  try {
    const inputs = validateInputs(req.body);
    await client.query("BEGIN");
    const loggedUser = await queryLogin(inputs);
    // Create JWTs
    const accessToken = jwt.sign(
      {
        user_info: {
          user_id: loggedUser.user_id,
          username: loggedUser.username,
          email: loggedUser.email,
          profile_picture: loggedUser.profile_picture,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "4h" }
    );

    const refreshToken = jwt.sign(
      { email: loggedUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Saving refreshToken with current user to DB
    const savedRefreshToken = await queryUpdateRefreshToken(
      loggedUser.user_id,
      refreshToken
    );
    res.cookie("jwt", savedRefreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    await client.query("COMMIT");
    res.json({
      access_token: accessToken,
      user_id: loggedUser.user_id,
      username: loggedUser.username,
      email: loggedUser.email,
      profile_picture: loggedUser.profile_picture,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    throw new Error(err);
  } finally {
    client.release();
  }
}

module.exports = login;
