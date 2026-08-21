import { User, CreateUserDTO, UpdateUserDTO, UserQueryParams, UserStats, UserStatus } from '../types/user.ts';

const AVATAR_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
];

const INITIAL_USERS: User[] = [
  {
    id: 'usr_1',
    name: 'Ana Carolina Silva',
    email: 'ana.silva@empresa.com.br',
    role: 'Administrador',
    department: 'Tecnologia',
    phone: '(11) 98765-4321',
    status: 'active',
    bio: 'Tech Lead responsável pela arquitetura e governança de sistemas.',
    avatarColor: '#3b82f6',
    createdAt: '2025-01-15T09:30:00.000Z',
    updatedAt: '2025-02-10T14:20:00.000Z',
  },
  {
    id: 'usr_2',
    name: 'Lucas Gabriel Oliveira',
    email: 'lucas.oliveira@empresa.com.br',
    role: 'Desenvolvedor',
    department: 'Tecnologia',
    phone: '(11) 97654-3210',
    status: 'active',
    bio: 'Desenvolvedor Full Stack focado em React, Node.js e TypeScript.',
    avatarColor: '#10b981',
    createdAt: '2025-01-20T11:00:00.000Z',
    updatedAt: '2025-02-15T16:45:00.000Z',
  },
  {
    id: 'usr_3',
    name: 'Mariana Santos Costa',
    email: 'mariana.costa@empresa.com.br',
    role: 'Designer',
    department: 'Design',
    phone: '(21) 99887-6655',
    status: 'active',
    bio: 'UI/UX Designer especialista em Design Systems e acessibilidade digital.',
    avatarColor: '#8b5cf6',
    createdAt: '2025-02-01T08:15:00.000Z',
    updatedAt: '2025-02-18T10:00:00.000Z',
  },
  {
    id: 'usr_4',
    name: 'Rafael Pereira Rocha',
    email: 'rafael.rocha@empresa.com.br',
    role: 'Gerente de Produto',
    department: 'Produto',
    phone: '(31) 98456-1122',
    status: 'active',
    bio: 'PM liderando o roadmap de expansão da plataforma e discovery contínuo.',
    avatarColor: '#f59e0b',
    createdAt: '2025-02-05T13:40:00.000Z',
    updatedAt: '2025-02-19T09:10:00.000Z',
  },
  {
    id: 'usr_5',
    name: 'Beatriz Lima Fernandes',
    email: 'beatriz.fernandes@empresa.com.br',
    role: 'Analista',
    department: 'Operações',
    phone: '(41) 99123-4567',
    status: 'pending',
    bio: 'Analista de Processos com foco em automação e métricas de eficiência.',
    avatarColor: '#ec4899',
    createdAt: '2025-02-12T15:00:00.000Z',
    updatedAt: '2025-02-12T15:00:00.000Z',
  },
  {
    id: 'usr_6',
    name: 'Rodrigo Alves Moreira',
    email: 'rodrigo.moreira@empresa.com.br',
    role: 'Suporte',
    department: 'Operações',
    phone: '(19) 98234-5678',
    status: 'inactive',
    bio: 'Especialista em atendimento e suporte técnico ao cliente.',
    avatarColor: '#06b6d4',
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-02-01T17:30:00.000Z',
  },
];

/**
 * In-Memory Repository for User Entity
 */
class InMemoryUserRepository {
  private users: User[] = JSON.parse(JSON.stringify(INITIAL_USERS));

  public async findAll(params: UserQueryParams = {}): Promise<{ data: User[]; total: number }> {
    const { search, role, department, status, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    let filtered = [...this.users];

    // Search query filter
    if (search && search.trim() !== '') {
      const query = search.toLowerCase().trim();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.role.toLowerCase().includes(query) ||
          u.department.toLowerCase().includes(query) ||
          (u.phone && u.phone.toLowerCase().includes(query))
      );
    }

    // Role filter
    if (role && role !== 'all') {
      filtered = filtered.filter((u) => u.role === role);
    }

    // Department filter
    if (department && department !== 'all') {
      filtered = filtered.filter((u) => u.department === department);
    }

    // Status filter
    if (status && status !== 'all') {
      filtered = filtered.filter((u) => u.status === status);
    }

    // Sorting
    filtered.sort((a, b) => {
      let fieldA: any = a[sortBy as keyof User] || '';
      let fieldB: any = b[sortBy as keyof User] || '';

      if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase();
      if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase();

      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return {
      data: filtered,
      total: filtered.length,
    };
  }

  public async findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user ? { ...user } : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    return user ? { ...user } : null;
  }

  public async create(dto: CreateUserDTO): Promise<User> {
    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const now = new Date().toISOString();

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      role: dto.role || 'Desenvolvedor',
      department: dto.department || 'Tecnologia',
      phone: dto.phone ? dto.phone.trim() : '',
      status: dto.status || 'active',
      bio: dto.bio ? dto.bio.trim() : '',
      avatarColor: randomColor,
      createdAt: now,
      updatedAt: now,
    };

    this.users.unshift(newUser);
    return { ...newUser };
  }

  public async update(id: string, dto: UpdateUserDTO): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const existing = this.users[index];
    const updated: User = {
      ...existing,
      name: dto.name !== undefined ? dto.name.trim() : existing.name,
      email: dto.email !== undefined ? dto.email.trim().toLowerCase() : existing.email,
      role: dto.role || existing.role,
      department: dto.department || existing.department,
      phone: dto.phone !== undefined ? dto.phone.trim() : existing.phone,
      status: dto.status || existing.status,
      bio: dto.bio !== undefined ? dto.bio.trim() : existing.bio,
      updatedAt: new Date().toISOString(),
    };

    this.users[index] = updated;
    return { ...updated };
  }

  public async updateStatus(id: string, status: UserStatus): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    this.users[index].status = status;
    this.users[index].updatedAt = new Date().toISOString();
    return { ...this.users[index] };
  }

  public async delete(id: string): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const [deleted] = this.users.splice(index, 1);
    return deleted;
  }

  public async getStats(): Promise<UserStats> {
    const total = this.users.length;
    const active = this.users.filter((u) => u.status === 'active').length;
    const inactive = this.users.filter((u) => u.status === 'inactive').length;
    const pending = this.users.filter((u) => u.status === 'pending').length;

    const roles = this.users.reduce((acc: Record<string, number>, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    const departments = this.users.reduce((acc: Record<string, number>, user) => {
      acc[user.department] = (acc[user.department] || 0) + 1;
      return acc;
    }, {});

    return { total, active, inactive, pending, roles, departments };
  }

  public async reset(): Promise<User[]> {
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    return [...this.users];
  }
}

export const userRepository = new InMemoryUserRepository();
