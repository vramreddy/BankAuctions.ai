import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  logger.error(`[Error] ${req.method} ${req.originalUrl}:`, err.stack || err.message);

  if (err.name === 'ZodError') {
    const issues = Array.isArray(err.issues) ? err.issues : Array.isArray(err.errors) ? err.errors : [];
    const errors = issues.map(issue => ({ field: (issue.path || []).join('.'), message: issue.message }));
    return res.status(400).json({
      success: false,
      message: errors.map(error => error.message).join(' ') || 'Please check your details and try again.',
      errors
    });
  }

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
