import { afterEach, describe, expect, it, vi } from 'vitest';
import { UserService } from '../../src/services/userService.ts';
import { User } from '../../src/types.ts';

const mockUser: User = {
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
};

function mockJsonResponse(body: unknown, ok = true): Response {
  return {
    ok,
    json: async () => body,
  } as Response;
}

describe('UserService (Frontend API Client Layer)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call fetch with query params and return users list on getAllUsers', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockJsonResponse({ success: true, data: [mockUser], total: 1 }));

    const service = new UserService();
    const result = await service.getAllUsers({
      search: 'Ana',
      role: 'Administrador',
      department: 'Tecnologia',
      status: 'active',
      sortBy: 'name',
      sortOrder: 'asc',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/users?search=Ana&role=Administrador&department=Tecnologia&status=active&sortBy=name&sortOrder=asc'
    );
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Ana Carolina');
    expect(result.total).toBe(1);
  });

  it('should get stats', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockJsonResponse({
        success: true,
        stats: {
          total: 1,
          active: 1,
          inactive: 0,
          pending: 0,
          roles: { Administrador: 1 },
          departments: { Tecnologia: 1 },
        },
      })
    );

    const service = new UserService();
    const result = await service.getStats();

    expect(result.total).toBe(1);
    expect(result.active).toBe(1);
  });

  it('should create a user using JSON payload', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockJsonResponse({ success: true, data: mockUser, message: 'Criado' }));

    const service = new UserService();
    const payload = {
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
      department: mockUser.department,
      phone: mockUser.phone,
      status: mockUser.status,
    };

    const result = await service.createUser(payload);

    expect(fetchMock).toHaveBeenCalledWith('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    expect(result.user.id).toBe(mockUser.id);
    expect(result.message).toBe('Criado');
  });

  it('should update a user using PUT', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockJsonResponse({ success: true, data: mockUser, message: 'Atualizado' }));

    const service = new UserService();
    const payload = {
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
      department: mockUser.department,
      phone: mockUser.phone,
      status: mockUser.status,
    };

    const result = await service.updateUser('usr_1', payload);

    expect(fetchMock).toHaveBeenCalledWith('/api/users/usr_1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    expect(result.message).toBe('Atualizado');
  });

  it('should update status with PATCH', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockJsonResponse({ success: true, data: mockUser, message: 'Atualizado' }));

    const service = new UserService();
    const result = await service.updateStatus('usr_1', 'inactive');

    expect(fetchMock).toHaveBeenCalledWith('/api/users/usr_1/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'inactive' }),
    });
    expect(result.message).toBe('Atualizado');
  });

  it('should delete a user', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockJsonResponse({ success: true, data: mockUser, message: 'Removido' }));

    const service = new UserService();
    const result = await service.deleteUser('usr_1');

    expect(fetchMock).toHaveBeenCalledWith('/api/users/usr_1', { method: 'DELETE' });
    expect(result.user.id).toBe('usr_1');
  });

  it('should reset database through the API client', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockJsonResponse({ success: true, data: [mockUser], message: 'Resetado' }));

    const service = new UserService();
    const result = await service.resetDatabase();

    expect(fetchMock).toHaveBeenCalledWith('/api/users/reset', { method: 'POST' });
    expect(result.users).toHaveLength(1);
  });

  it('should throw clear error message when backend responds with error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockJsonResponse(
        {
          success: false,
          message: 'Ja existe um usuario cadastrado com este e-mail.',
        },
        false
      )
    );

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
    ).rejects.toThrow('Ja existe um usuario cadastrado com este e-mail.');
  });
});
