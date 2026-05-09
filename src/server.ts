import 'dotenv/config';
import 'reflect-metadata';
import app from './app';
import { prisma } from './lib/prisma';
import { app as appConfig } from './config';
import { logger } from './utils';

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Prisma connected to database');

    app.listen(appConfig.port, () => {
      logger.info(`Server running on port ${appConfig.port}`);
    });
  } catch (error) {
    logger.error({
      message: 'Failed to connect to database',
      error,
    });
    process.exit(1);
  }
};

startServer();
