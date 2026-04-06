import 'dotenv/config';

export const config = {
  port: parseInt(process.env.API_PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL!,
  redisUrl: process.env.REDIS_URL!,
};
