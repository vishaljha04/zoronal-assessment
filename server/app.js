const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const companyRoutes = require('./routes/companyRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

const getAllowedOrigins = () => {
  const raw = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'https://zoronal-assessment.vercel.app';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // non-browser requests
  const allowlist = getAllowedOrigins();
  if (allowlist.length === 0) return true;
  if (allowlist.includes(origin)) return true;
  // Allow Vercel preview deployments if a base domain is allowlisted
  if (origin.endsWith('.vercel.app')) {
    const allowedVercel = allowlist.some((o) => o.endsWith('.vercel.app'));
    if (allowedVercel) return true;
  }
  return false;
};

const corsOptions = {
  origin: (origin, cb) => {
    if (isAllowedOrigin(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Review & Rate API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
