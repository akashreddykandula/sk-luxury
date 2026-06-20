const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');
const helmet = require ('helmet');
const morgan = require ('morgan');
const rateLimit = require ('express-rate-limit');
require ('dotenv').config ();

const app = express ();

// Security middleware
app.use (helmet ({crossOriginResourcePolicy: {policy: 'cross-origin'}}));

// Rate limiting
const limiter = rateLimit ({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: 'Too many requests from this IP, please try again later.',
});
app.use ('/api/', limiter);

// CORS
app.use (
  cors ({
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use (express.json ({limit: '10mb'}));
app.use (express.urlencoded ({extended: true, limit: '10mb'}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use (morgan ('dev'));
}

// Database connection
mongoose
  .connect (process.env.MONGO_URI)
  .then (() => console.log ('✅ MongoDB Connected: SK Luxury Database'))
  .catch (err => console.error ('❌ MongoDB Error:', err));

// Routes
app.use ('/api/auth', require ('./routes/authRoutes'));
app.use ('/api/products', require ('./routes/productRoutes'));
app.use ('/api/categories', require ('./routes/categoryRoutes'));
app.use ('/api/orders', require ('./routes/orderRoutes'));
app.use ('/api/payments', require ('./routes/paymentRoutes'));
app.use ('/api/upload', require ('./routes/uploadRoutes'));
app.use ('/api/admin', require ('./routes/adminRoutes'));
app.use ('/api/banners', require ('./routes/bannerRoutes'));

// Health check
app.get ('/api/health', (req, res) => {
  res.json ({
    status: 'OK',
    message: 'SK Luxury API is running',
    timestamp: new Date (),
  });
});

// 404 handler
app.use ((req, res) => {
  res.status (404).json ({success: false, message: 'Route not found'});
});

// Global error handler
app.use ((err, req, res, next) => {
  console.error (err.stack);
  res.status (err.statusCode || 500).json ({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {stack: err.stack}),
  });
});

const PORT = process.env.PORT || 5000;
app.listen (PORT, () => {
  console.log (`🚀 SK Luxury Server running on port ${PORT}`);
  console.log (`🌿 Environment: ${process.env.NODE_ENV}`);
});
