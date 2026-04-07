import { app } from './app';
import { config } from './config';
import { prisma } from './prisma';

async function main() {
  await prisma.$connect();
  console.log('Connected to database');

  app.listen(config.port, () => {
    console.log(`API server running on port ${config.port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start API server:', err);
  process.exit(1);
});
