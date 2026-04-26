import { createClient } from 'redis';
import { app } from '../config';

export const redis = createClient({
  url: app.redisUrl,
});

redis.connect();