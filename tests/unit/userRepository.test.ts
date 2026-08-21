import { describe, it, expect, beforeEach } from 'vitest';
import { userRepository } from '../../server/db/inMemoryStore.ts';
import { CreateUserDTO } from '../../server/types/user.ts';

describe('InMemoryUserRepository (Backend Data Layer)', () => {
  beforeEach(async () => {
    // Reset seed before each test run to ensure isolation
    await userRepository.reset();
  });

  it('should list all initial users', async () => {
    const result = await userRepository.findAll();
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBe(result.data.length);
  });

  it('should filter users by search query in name, email or role', async () => {
    const result = await userRepository.findAll({ search: 'Ana' });
    expect(result.data.length).toBeGreaterThan(0);
    // Beatriz has role 'Analista', Ana has name 'Ana'
    result.data.forEach((user) => {
      const match =
        user.name.toLowerCase().includes('ana') ||
        user.email.toLowerCase().includes('ana') ||
        user.role.toLowerCase().includes('ana');
      expect(match).toBe(true);
    });
  });

  it('should filter users by department and role', async () => {
    const result = await userRepository.findAll({ department: 'Tecnologia' });
    result.data.forEach((user) => {
      expect(user.department).toBe('Tecnologia');
    });
  });

  it('should create a new user with generated id and avatarColor', async () => {
    const newUserDto: CreateUserDTO = {
      name: 'Carlos Eduardo Teste',
      email: 'carlos.teste@empresa.com.br',
      role: 'Desenvolvedor',
      department: 'Tecnologia',
      phone: '(11) 99999-8888',
      status: 'active',
      bio: 'Desenvolvedor de testes automatizados.',
    };

    const created = await userRepository.create(newUserDto);
    expect(created.id).toBeDefined();
    expect(created.name).toBe(newUserDto.name);
    expect(created.email).toBe(newUserDto.email);
    expect(created.avatarColor).toBeDefined();

    const found = await userRepository.findById(created.id);
    expect(found).not.toBeNull();
    expect(found?.email).toBe(newUserDto.email);
  });

  it('should update user fields successfully', async () => {
    const initialList = await userRepository.findAll();
    const targetUser = initialList.data[0];

    const updated = await userRepository.update(targetUser.id, {
      name: 'Nome Atualizado Pelo Teste',
      role: 'Gerente de Produto',
    });

    expect(updated).not.toBeNull();
    expect(updated?.name).toBe('Nome Atualizado Pelo Teste');
    expect(updated?.role).toBe('Gerente de Produto');
    expect(updated?.email).toBe(targetUser.email); // email should stay intact
  });

  it('should update user status', async () => {
    const initialList = await userRepository.findAll();
    const targetUser = initialList.data[0];

    const updated = await userRepository.updateStatus(targetUser.id, 'inactive');
    expect(updated?.status).toBe('inactive');

    const check = await userRepository.findById(targetUser.id);
    expect(check?.status).toBe('inactive');
  });

  it('should delete a user and return the deleted object', async () => {
    const initialList = await userRepository.findAll();
    const countBefore = initialList.total;
    const targetId = initialList.data[0].id;

    const deleted = await userRepository.delete(targetId);
    expect(deleted).not.toBeNull();
    expect(deleted?.id).toBe(targetId);

    const check = await userRepository.findById(targetId);
    expect(check).toBeNull();

    const afterList = await userRepository.findAll();
    expect(afterList.total).toBe(countBefore - 1);
  });

  it('should compute valid stats for active, inactive and pending users', async () => {
    const stats = await userRepository.getStats();
    expect(stats.total).toBe(stats.active + stats.inactive + stats.pending);
    expect(stats.roles).toBeDefined();
    expect(stats.departments).toBeDefined();
  });
});
