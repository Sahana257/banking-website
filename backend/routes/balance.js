const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
require('dotenv').config();

// POST /api/getBalance
router.post('/getBalance', async (req, res) => {
  const token = req.cookies?.kodbank_token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  try {
    // Verify & validate JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    // Check token exists in DB (not revoked)
    const [tokenRows] = await pool.execute('SELECT * FROM CJWT WHERE token = ?', [token]);
    if (tokenRows.length === 0) {
      return res.status(401).json({ message: 'Token not recognized. Please log in again.' });
    }

    // Extract username from token subject
    const username = decoded.sub;

    // Fetch balance from koduser using username
    const [userRows] = await pool.execute(
      'SELECT balance FROM koduser WHERE cname = ?',
      [username]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const balance = parseFloat(userRows[0].balance).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return res.status(200).json({ balance, username });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error while fetching balance.' });
  }
});

module.exports = router;
