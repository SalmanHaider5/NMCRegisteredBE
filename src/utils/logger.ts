import pino from 'pino';
import { app } from '../config';

export const logger = pino({
  level: app.logLevel || 'info'
});