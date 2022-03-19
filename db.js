const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Kamikaze99",
  host: "localhost",
  port: 5434,
  database: "drc_database",
});

module.exports = pool;
