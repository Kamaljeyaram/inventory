require('dotenv').config(); // ✅ Load env variables at the top!

const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const { initDatabase, pool } = require('./config/database');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const inventoryRoutes = require('./routes/inventory');
const categoryRoutes = require('./routes/categories');
const supplierRoutes = require('./routes/suppliers');
const orderRoutes = require('./routes/orders');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).json({
      status: 'error',
      message: options.message,
    });
  }
});
app.use('/api', apiLimiter);

// Health check
app.get('/health', async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT 1');
    res.json({
      status: 'success',
      message: 'Server is healthy',
      database: 'Connected successfully',
      timestamp: new Date(),
      serverPort: config.server.port,
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date()
    });
  }
});

// Test route
app.get('/test', (req, res) => {
  res.json({
    message: 'Test endpoint working!',
    time: new Date()
  });
});

// API routes
const apiPrefix = `${config.api.prefix}${config.api.version}`;
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/products`, productRoutes);
app.use(`${apiPrefix}/inventory`, inventoryRoutes);
app.use(`${apiPrefix}/categories`, categoryRoutes);
app.use(`${apiPrefix}/suppliers`, supplierRoutes);
app.use(`${apiPrefix}/orders`, orderRoutes);
app.use(`${apiPrefix}/reports`, reportRoutes);

// Serve static in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  logger.error('Server error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const startServer = async () => {
  try {
    await initDatabase();

    const PORT = config.server.port;
    const server = app.listen(PORT, () => {
      logger.info(`✅ Server running in ${config.server.env} mode on port ${PORT}`);
    });

    server.timeout = 120000;
    server.keepAliveTimeout = 60000;

    server.on('error', (error) => {
      logger.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} in use. Retrying in 10 seconds...`);
        setTimeout(() => {
          server.close();
          server.listen(PORT);
        }, 10000);
      }
    });

    const gracefulShutdown = () => {
      logger.info('Gracefully shutting down...');
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forcefully shutting down...');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    logger.error('❌ Failed to start the server:', error);
    console.error('❌ Startup error:', error); // fallback in case logger fails
    process.exit(1);
  }
};

// 🔥 Catch top-level error from async start
startServer().catch((err) => {
  console.error('❌ Uncaught startup error:', err);
});
