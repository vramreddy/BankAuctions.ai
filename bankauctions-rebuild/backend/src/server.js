import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

const PORT = config.port;

const HOST = '127.0.0.1';
const server = app.listen(PORT, HOST, () => {
  logger.info(`====================================================`);
  logger.info(` BankAuctions.ai Backend API Engine Online`);
  logger.info(` Port: http://${HOST}:${PORT}`);
  logger.info(` API Root: http://${HOST}:${PORT}/api/v1`);
  logger.info(` Health Check: http://${HOST}:${PORT}/api/v1/health`);
  logger.info(` Environment: ${config.env}`);
  logger.info(`====================================================`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    logger.info('Process terminated.');
  });
});
