import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`====================================================`);
  logger.info(` BankAuctions.ai Backend API Engine Online`);
  logger.info(` Port: http://localhost:${PORT}`);
  logger.info(` API Root: http://localhost:${PORT}/api/v1`);
  logger.info(` Health Check: http://localhost:${PORT}/api/v1/health`);
  logger.info(` Environment: ${config.env}`);
  logger.info(`====================================================`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    logger.info('Process terminated.');
  });
});
