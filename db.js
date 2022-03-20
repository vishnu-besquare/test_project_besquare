const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "test_testing",
  host: "localhost",
  port: 5433,
  database: "drc_database",
});

module.exports = pool;
