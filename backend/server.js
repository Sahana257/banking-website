const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { initDB } = require('./db');
const authRoutes = require('./routes/auth');
const balanceRoutes = require('./routes/balance');

const app = express();

// ✅ CORS FIX (IMPORTANT)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/balance', balanceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Kodbank API is running 🚀' });
});

// Root route (to avoid "Cannot GET /")
app.get('/', (req, res) => {
  res.send("Kodbank Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🏦 Kodbank backend running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });