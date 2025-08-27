const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Adnan@2546",
  database: "school_db",
});

module.exports = pool;
