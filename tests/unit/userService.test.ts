import { describe, it, expect } from 'vitest';
import { UserService } from '../../src/services/userService.ts';

// Mocking global fetch for testing the service layer in isolation
describe('UserService (Frontend API Client Layer)', () => {
  it('should call fetch and return users list on getAllUsers', async () => {
    const mockUsers = [
      {
        id: 'usr_1',
        name: 'Ana Carolina',
        email: 'ana@empresa.com.br',
        role: 'Administrador',
        department: 'Tecnologia',
        phone: '11999999999',
        status: 'active',
        avatarColor: '#3b82f6',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    ];

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      ({
        ok: true,
        json: async () => ({
          success: true,
          data: mockUsers,
          total: 1,
        }),
      } as any);

    const service = new UserService();
    const result = await service.getAllUsers();

    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Ana Carolina');
    expect(result.total).toBe(1);

    globalThis.fetch = originalFetch;
  });

  it('should throw clear error message when backend responds with error', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      ({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Já existe um usuário cadastrado com este e-mail.',
        }),
      } as any);

    const service = new UserService();

    await expect(
      service.createUser({
        name: 'Duplicado',
        email: 'dup@empresa.com.br',
        role: 'Desenvolvedor',
        department: 'Tecnologia',
        phone: '',
        status: 'active',
      })
    ).rejects.toThrow('Já existe um usuário cadastrado com este e-mail.');

    globalThis.fetch = originalFetch;
  });
});
