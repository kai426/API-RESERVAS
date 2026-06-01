require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const errorMiddleware = require('./middlewares/errorMiddleware');
const ApiError = require('./utils/ApiError');

// Routes
const authRoutes = require('./routes/authRoutes');

const app = express();

// ─── Security & Parsing ───────────────────────────────────────────────────────
app.use(helmet());
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

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  next(ApiError.notFound(`Rota não encontrada: ${req.method} ${req.originalUrl}`));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
