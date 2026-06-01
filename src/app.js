require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');

const app = express();

// ─── Security & Parsing ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API de Gestão de Reservas está operacional',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});


module.exports = app;
