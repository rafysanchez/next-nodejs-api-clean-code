export type UserRole =
  | 'Administrador'
  | 'Desenvolvedor'
  | 'Designer'
  | 'Gerente de Produto'
  | 'Analista'
  | 'Suporte';

export type UserDepartment =
  | 'Tecnologia'
  | 'Design'
  | 'Produto'
  | 'Operações'
  | 'Comercial'
  | 'RH';

export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: UserDepartment;
  phone: string;
  status: UserStatus;
  bio?: string;
  avatarColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  role: UserRole;
  department: UserDepartment;
  phone?: string;
  status?: UserStatus;
  bio?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
  department?: UserDepartment;
  phone?: string;
  status?: UserStatus;
  bio?: string;
}

export interface UserQueryParams {
  search?: string;
  role?: string;
  department?: string;
  status?: string;
  sortBy?: keyof User | string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  roles: Record<string, number>;
  departments: Record<string, number>;
}
