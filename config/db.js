const { Pool, types } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "snowman",
  host: "localhost",
  port: 5432,
  database: "video-conference",
});

// config - parser
types.setTypeParser(20, (val) => {
  return parseInt(val, 10);
});

types.setTypeParser(1700, (val) => {
  return parseFloat(val);
});

module.exports = pool;
