import {
  User,
  UserFormData,
  UserStats,
  UserStatus,
} from '../types.ts';

export class UserService {
  private baseUrl = '/api/users';

  async getAllUsers(params?: {
    search?: string;
    role?: string;
    department?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: User[]; total: number }> {
    const query = new URLSearchParams();

    if (params) {
      if (params.search) query.append('search', params.search);
      if (params.role && params.role !== 'all') query.append('role', params.role);
      if (params.department && params.department !== 'all') query.append('department', params.department);
      if (params.status && params.status !== 'all') query.append('status', params.status);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    }

    const res = await fetch(`${this.baseUrl}?${query.toString()}`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Falha ao buscar lista de usuários.');
    }

    return {
      data: json.data,
      total: json.total,
    };
  }

  async getStats(): Promise<UserStats> {
    const res = await fetch(`${this.baseUrl}/stats`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Falha ao buscar estatísticas.');
    }

    return json.stats;
  }

  async getUserById(id: string): Promise<User> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Usuário não encontrado.');
    }

    return json.data;
  }

  async createUser(formData: UserFormData): Promise<{ user: User; message: string }> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Não foi possível cadastrar o usuário.');
    }

    return {
      user: json.data,
      message: json.message,
    };
  }

  async updateUser(id: string, formData: UserFormData): Promise<{ user: User; message: string }> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Não foi possível atualizar o usuário.');
    }

    return {
      user: json.data,
      message: json.message,
    };
  }

  async updateStatus(id: string, status: UserStatus): Promise<{ user: User; message: string }> {
    const res = await fetch(`${this.baseUrl}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Não foi possível alterar o status.');
    }

    return {
      user: json.data,
      message: json.message,
    };
  }

  async deleteUser(id: string): Promise<{ user: User; message: string }> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Falha ao remover o usuário.');
    }

    return {
      user: json.data,
      message: json.message,
    };
  }

  async resetDatabase(): Promise<{ users: User[]; message: string }> {
    const res = await fetch(`${this.baseUrl}/reset`, {
      method: 'POST',
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Não foi possível resetar os dados.');
    }

    return {
      users: json.data,
      message: json.message,
    };
  }
}

export const userService = new UserService();
