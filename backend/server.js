const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app = express();

// ── CORS ─────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['*'];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ── ADMIN PORTAL (static) ─────────────────────────────────────
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ── API ROUTES ────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/hospitals',    require('./routes/hospitals'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/claims',       require('./routes/claims'));
app.use('/api/admin',        require('./routes/admin'));

// ── HEALTH CHECK ──────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', ts: new Date() }));

// ── START ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dr. Cashless API running on port ${PORT}`));
