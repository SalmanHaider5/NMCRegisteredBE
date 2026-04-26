import { redis } from '../../lib/redis';

export class AuthSessionService {
  private static key(userId: number) {
    return `refresh_token:user:${userId}`;
  }

  static async set(userId: number, token: string) {
    await redis.set(this.key(userId), token, {
      EX: 7 * 24 * 60 * 60
    });
  }

  static async get(userId: number) {
    return redis.get(this.key(userId));
  }

  static async remove(userId: number) {
    await redis.del(this.key(userId));
  }
}