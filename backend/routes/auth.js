const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../db');
require('dotenv').config();

// POST /api/register
router.post('/register', async (req, res) => {
  const { uname, password, email, phone } = req.body;

  if (!uname || !password || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const uid = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute(
      `INSERT INTO koduser (uid, cname, cpassword, email, phone, role, balance)
       VALUES (?, ?, ?, ?, ?, 'customer', 100000.00)`,
      [uid, uname, hashedPassword, email, phone]
    );
    return res.status(201).json({ message: 'Registration successful! Please log in.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username already exists.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  const { uname, password } = req.body;

  if (!uname || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM koduser WHERE cname = ?', [uname]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.cpassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Generate JWT: username as subject, role as claim
    const expiresIn = '2h';
    const token = jwt.sign(
      { sub: user.cname, role: user.role },
      process.env.JWT_SECRET,
      { algorithm: 'HS256', expiresIn }
    );

    // Store token in CJWT table
    const expDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
    await pool.execute(
      'INSERT INTO CJWT (token, cid, exp) VALUES (?, ?, ?)',
      [token, user.uid, expDate]
    );

    // Set JWT as HTTP-only cookie
    res.cookie('kodbank_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000
    });

    return res.status(200).json({ message: 'Login successful!', username: user.cname });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

// POST /api/logout
router.post('/logout', (req, res) => {
  res.clearCookie('kodbank_token');
  return res.status(200).json({ message: 'Logged out successfully.' });
});

module.exports = router;
