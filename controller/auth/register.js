const pool = require("../../config/db");
const { validateParameterString } = require("../../functions/validate");

function validateInputs(body) {
  if (
    validateParameterString(body.username) === false ||
    validateParameterString(body.email) === false ||
    validateParameterString(body.password) === false
  ) {
    throw Error("Input invalid!");
  } else {
    return body;
  }
}

async function queryRegister(inputs) {
  const queryResult = await pool.query(
    `
            INSERT INTO "user" (
                username,
                email,
                password
            ) 
            VALUES ($1, $2, CRYPT($3, gen_salt('bf')))
            RETURNING user_id,
                      username,
                      email,
                      password
        `,
    [inputs.username, inputs.email, inputs.password]
  );
  if (queryResult.rowCount === 0) {
    return null;
  }
  return queryResult.rows;
}

async function register(req, res) {
  try {
    const inputs = validateInputs(req.body);
    const newUsers = await queryRegister(inputs);
    return res.json(newUsers);
  } catch (err) {
    console.error(err.message);
    throw new Error(err);
  }
}

module.exports = register;
