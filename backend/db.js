const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDB() {
  const conn = await pool.getConnection();
  try {
    // koduser table (customers)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS koduser (
        uid VARCHAR(50) PRIMARY KEY,
        cname VARCHAR(100) NOT NULL UNIQUE,
        cpassword VARCHAR(255) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'customer',
        balance DECIMAL(15,2) DEFAULT 100000.00
      )
    `);

    // CJWT table (UserToken)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS CJWT (
        tid INT AUTO_INCREMENT PRIMARY KEY,
        token TEXT NOT NULL,
        cid VARCHAR(50),
        exp DATETIME,
        FOREIGN KEY (cid) REFERENCES koduser(uid)
      )
    `);

    console.log('✅ Database tables ready');
  } finally {
    conn.release();
  }
}

module.exports = { pool, initDB };
