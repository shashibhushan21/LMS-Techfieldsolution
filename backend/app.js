const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const ensureAdmin = require('./config/ensureAdmin');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB().then(() => {
  // Ensure admin user exists based on env
  ensureAdmin();
});

const app = express();

// Trust proxy is required when running behind a proxy (like Render, Heroku, Nginx)
// to correctly identify the client's IP address.
app.set('trust proxy', 1);

// CORS - Must be first
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'https://lms-techfieldsolution.vercel.app',
    'https://lms.techfieldsolution.com'
  ].filter(Boolean),
  credentials: true
}));

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// Rate limiting - More lenient in development
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : (process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Don't count successful requests
  skip: (req) => {
    // Skip rate limiting for health check in development
    return process.env.NODE_ENV === 'development' && req.path === '/health';
  }
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/modules', require('./routes/modules'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/mentors', require('./routes/mentors'));
app.use('/api/admin/system', require('./routes/system'));
app.use('/api/system', require('./routes/system'));

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
