const pool = require("../../config/db");

async function queryRegister(inputs) {
  const queryResult = await pool.query(
    `
            INSERT INTO "user" (
                username,
                email,
                profile_picture
            ) 
            VALUES ($1, $2, $3)
            ON CONFLICT(email)
            DO NOTHING
            RETURNING user_id,
                      username,
                      email,
                      password,
                      profile_picture
        `,
    [inputs.name, inputs.email, inputs.picture]
  );
  if (queryResult.rowCount === 0) {
    return null;
  }
  return queryResult.rows;
}

async function oAuthLogin(req, res, inputs) {
  try {
    const newUsers = await queryRegister(inputs);
    console.log(newUsers);
    res.redirect("http://127.0.0.1:3000/passport-callback");
  } catch (err) {
    console.error(err.message);
    throw new Error(err);
  }
}

module.exports = oAuthLogin;
