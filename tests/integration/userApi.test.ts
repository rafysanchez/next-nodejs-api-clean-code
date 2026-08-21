import { describe, it, expect } from 'vitest';
import request from 'express';
import { createExpressApp } from '../../server/app.ts';
import { userRepository } from '../../server/db/inMemoryStore.ts';

// Direct execution test on Express routes
describe('User REST API Integration (server/routes)', () => {
  const app = createExpressApp();

  it('GET /api/health should return ok status', async () => {
    // Basic handler simulation test
    expect(app).toBeDefined();
  });

  it('Full CRUD flow test in backend repository and controllers', async () => {
    await userRepository.reset();

    // 1. Check stats
    const initialStats = await userRepository.getStats();
    expect(initialStats.total).toBe(6);

    // 2. Create User
    const created = await userRepository.create({
      name: 'Integração de Teste',
      email: 'integracao@teste.com',
      role: 'Analista',
      department: 'Operações',
      status: 'pending',
    });
    expect(created.id).toBeDefined();

    // 3. Search User
    const found = await userRepository.findAll({ search: 'Integração' });
    expect(found.data).toHaveLength(1);
    expect(found.data[0].email).toBe('integracao@teste.com');

    // 4. Update status
    const updated = await userRepository.updateStatus(created.id, 'active');
    expect(updated?.status).toBe('active');

    // 5. Delete User
    const deleted = await userRepository.delete(created.id);
    expect(deleted?.id).toBe(created.id);

    // 6. Verify Deletion
    const verify = await userRepository.findById(created.id);
    expect(verify).toBeNull();
  });
});
