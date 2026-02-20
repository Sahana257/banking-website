const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { initDB } = require('./db');
const authRoutes = require('./routes/auth');
const balanceRoutes = require('./routes/balance');

const app = express();

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', authRoutes);
app.use('/api', balanceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Kodbank API is running 🚀' });
});

const PORT = process.env.PORT || 5000;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🏦 Kodbank backend running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
