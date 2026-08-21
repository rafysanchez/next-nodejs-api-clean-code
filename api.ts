import { createExpressApp } from './server/app.ts';
import { initializeDatabase } from './server/db/postgres.ts';

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  await initializeDatabase();

  const app = createExpressApp();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`User API server running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start API server:', err);
  process.exit(1);
});
