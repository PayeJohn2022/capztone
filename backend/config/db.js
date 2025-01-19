// config/db.js
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.RAILWAY_TCP_PROXY_DOMAIN, // Railway MySQL host
  user: process.env.MYSQLUSER, // MySQL username
  password: process.env.MYSQL_ROOT_PASSWORD, // MySQL password
  database: process.env.MYSQL_DATABASE, // MySQL database name
  port: process.env.RAILWAY_TCP_PROXY_PORT // MySQL port
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

module.exports = db;
