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
  | 'Operacoes'
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

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  department: UserDepartment;
  phone: string;
  status: UserStatus;
  bio?: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  roles: Record<string, number>;
  departments: Record<string, number>;
}

export type ModalType = 'create' | 'edit' | 'delete' | 'details' | null;

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export const ROLES_LIST: UserRole[] = [
  'Administrador',
  'Desenvolvedor',
  'Designer',
  'Gerente de Produto',
  'Analista',
  'Suporte',
];

export const DEPARTMENTS_LIST: UserDepartment[] = [
  'Tecnologia',
  'Design',
  'Produto',
  'Operacoes',
  'Comercial',
  'RH',
];
