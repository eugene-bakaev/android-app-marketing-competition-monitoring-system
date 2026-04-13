import { app } from './app';
import { config } from './config';
import { prisma } from './prisma';
import { screenshotQueue } from './queue';

async function main() {
  await prisma.$connect();
  console.log('Connected to database');

  const server = app.listen(config.port, () => {
    console.log(`API server running on port ${config.port}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await screenshotQueue.close();
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  console.error('Failed to start API server:', err);
  process.exit(1);
});
