// const mysql = require("mysql2/promise");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "ab@124",
//   database: "school_db",
// });

// module.exports = pool;
// =======================================
require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool
  .getConnection()
  .then((conn) => {
    console.log("Connected to Railway DB");
    conn.release();
  })
  .catch((err) => console.error("DB connection failed:", err));

module.exports = pool;
