import { createExpressApp } from './server/app.ts';

const PORT = Number(process.env.PORT) || 3000;

const app = createExpressApp();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`User API server running on port ${PORT}`);
});
