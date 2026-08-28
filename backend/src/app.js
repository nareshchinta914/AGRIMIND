const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorResponse } = require('./utils/response');

const app = express();

// 1. Security Headers via Helmet
app.use(helmet());

// 2. CORS Configuration
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 3. HTTP Request Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 4. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Global Rate Limiter
app.use('/api', apiLimiter);

// 6. API Route Mounting
app.use('/api', routes);

// 7. Root Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'AGRIMIND Core Agricultural Intelligence API is active and running',
    documentation: '/api/health',
    version: '1.0.0'
  });
});

// 8. 404 Handler
app.use((req, res) => {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND', 404);
});

// 9. Centralized Error Handler
app.use(errorHandler);

module.exports = app;
