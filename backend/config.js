// db.js

const { Pool } = require('pg');

// Replace these with your database details
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ruralMed',
  password: 'aimmi.a01',
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
