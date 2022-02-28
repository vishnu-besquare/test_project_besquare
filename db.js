const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Kamikaze99",
  host: "localhost",
  port: 5434,
  database: "vishnutest",
});

module.exports = pool;
