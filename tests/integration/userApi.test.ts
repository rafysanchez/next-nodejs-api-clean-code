import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createExpressApp } from '../../server/app.ts';
import { initializeDatabase } from '../../server/db/postgres.ts';
import { userRepository } from '../../server/db/userRepository.ts';

describe('User REST API Integration', () => {
  const app = createExpressApp();

  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    await userRepository.reset();
  });

  it('GET /api/health should return ok status', async () => {
    const response = await request(app).get('/api/health').expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.timestamp).toBeDefined();
  });

  it('should execute a full CRUD flow through HTTP endpoints', async () => {
    const createResponse = await request(app)
      .post('/api/users')
      .send({
        name: 'Integracao de Teste',
        email: 'integracao@teste.com',
        role: 'Analista',
        department: 'Operacoes',
        status: 'pending',
      })
      .expect(201);

    const createdId = createResponse.body.data.id;
    expect(createdId).toBeDefined();
    expect(createResponse.body.data.email).toBe('integracao@teste.com');

    const listResponse = await request(app).get('/api/users').query({ search: 'Integracao' }).expect(200);
    expect(listResponse.body.total).toBe(1);
    expect(listResponse.body.data[0].id).toBe(createdId);

    const updateResponse = await request(app)
      .patch(`/api/users/${createdId}/status`)
      .send({ status: 'active' })
      .expect(200);
    expect(updateResponse.body.data.status).toBe('active');

    const getResponse = await request(app).get(`/api/users/${createdId}`).expect(200);
    expect(getResponse.body.data.name).toBe('Integracao de Teste');

    const deleteResponse = await request(app).delete(`/api/users/${createdId}`).expect(200);
    expect(deleteResponse.body.data.id).toBe(createdId);

    await request(app).get(`/api/users/${createdId}`).expect(404);
  });

  it('should reject invalid user creation payloads', async () => {
    await request(app)
      .post('/api/users')
      .send({
        name: 'Al',
        email: 'al@example.com',
        role: 'Analista',
        department: 'Operacoes',
      })
      .expect(400);

    await request(app)
      .post('/api/users')
      .send({
        name: 'Email Invalido',
        email: 'email-invalido',
        role: 'Analista',
        department: 'Operacoes',
      })
      .expect(400);
  });

  it('should return 409 when creating a user with duplicated email', async () => {
    const payload = {
      name: 'Usuario Duplicado',
      email: 'duplicado@teste.com',
      role: 'Analista',
      department: 'Operacoes',
      status: 'active',
    };

    await request(app).post('/api/users').send(payload).expect(201);
    const duplicateResponse = await request(app).post('/api/users').send(payload).expect(409);

    expect(duplicateResponse.body.success).toBe(false);
  });

  it('should validate status updates and missing users', async () => {
    await request(app).patch('/api/users/usr_1/status').send({ status: 'blocked' }).expect(400);
    await request(app).patch('/api/users/usr_missing/status').send({ status: 'active' }).expect(404);
  });

  it('should return stats from the API', async () => {
    const response = await request(app).get('/api/users/stats').expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.stats.total).toBe(6);
    expect(response.body.stats.active + response.body.stats.inactive + response.body.stats.pending).toBe(6);
  });
});
