import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  logger.error(`[Error] ${req.method} ${req.originalUrl}:`, err.stack || err.message);
  if (['P1000','P1001','P1002','P1017'].includes(err.code)) return res.status(503).json({success:false,message:'Database connection unavailable. Please contact the platform administrator.'});
  if (err.code === 'P2002') return res.status(409).json({success:false,message:'This record already exists. Please check for a duplicate.'});
  if (err.code === 'P2025') return res.status(404).json({success:false,message:'The requested record was not found.'});

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
    message: statusCode >= 500 ? 'The server could not complete this request. Please try again.' : err.message || 'Request failed',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
