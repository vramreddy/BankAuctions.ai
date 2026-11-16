import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & Optimization
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}));

// HTTP Logging
if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiter on API surface
app.use('/api/', apiLimiter);

// Serve static public assets (images from frontend/public/images or prototype)
const publicImagesPath = path.join(__dirname, '../../frontend/public');
app.use(express.static(publicImagesPath));

// Mount REST API Version 1
app.use('/api/v1', routes);

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.originalUrl} not found` });
});

// Centralized Error Handling
app.use(errorHandler);

export default app;
