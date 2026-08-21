import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  UserFormData,
  UserStats,
  ModalType,
  ToastNotification,
  UserStatus,
} from '../types.ts';
import { userService } from '../services/userService.ts';

interface UserContextType {
  // State
  users: User[];
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  isBackendConnected: boolean;

  // Filter & Search states
  searchQuery: string;
  selectedRole: string;
  selectedDepartment: string;
  selectedStatus: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  viewMode: 'table' | 'grid';

  // Modals & Selection
  activeModal: ModalType;
  selectedUser: User | null;
  toasts: ToastNotification[];

  // CRUD Operations
  fetchUsers: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createUser: (data: UserFormData) => Promise<boolean>;
  updateUser: (id: string, data: UserFormData) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  toggleStatus: (id: string, newStatus: UserStatus) => Promise<boolean>;
  resetSeedData: () => Promise<void>;

  // Filter Setters
  setSearchQuery: (query: string) => void;
  setSelectedRole: (role: string) => void;
  setSelectedDepartment: (dept: string) => void;
  setSelectedStatus: (status: string) => void;
  setSorting: (field: string) => void;
  setViewMode: (mode: 'table' | 'grid') => void;
  clearFilters: () => void;

  // Modal Handlers
  openModal: (type: ModalType, user?: User) => void;
  closeModal: () => void;

  // Toast Handlers
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  // Filters & display
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals & current user
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastNotification = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await userService.getStats();
      setStats(data);
    } catch (err) {
      console.warn('Erro ao carregar estatísticas:', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await userService.getAllUsers({
        search: searchQuery,
        role: selectedRole,
        department: selectedDepartment,
        status: selectedStatus,
        sortBy,
        sortOrder,
      });
      setUsers(data);
      setIsBackendConnected(true);
    } catch (err: any) {
      console.error('Erro na camada de serviço:', err);
      setError(err.message || 'Não foi possível se comunicar com o backend.');
      setIsBackendConnected(false);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedRole, selectedDepartment, selectedStatus, sortBy, sortOrder]);

  // Initial load
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  const createUser = async (data: UserFormData): Promise<boolean> => {
    try {
      const result = await userService.createUser(data);

      addToast({
        type: 'success',
        title: 'Usuário cadastrado com sucesso!',
        message: `${result.user.name} foi adicionado à base de dados.`,
      });

      await fetchUsers();
      await fetchStats();
      closeModal();
      return true;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Erro ao cadastrar usuário',
        message: err.message || 'Falha ao processar solicitação no backend.',
      });
      return false;
    }
  };

  const updateUser = async (id: string, data: UserFormData): Promise<boolean> => {
    try {
      const result = await userService.updateUser(id, data);

      addToast({
        type: 'success',
        title: 'Usuário atualizado!',
        message: `As informações de ${result.user.name} foram salvas com sucesso.`,
      });

      await fetchUsers();
      await fetchStats();
      closeModal();
      return true;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Erro ao atualizar',
        message: err.message || 'Erro ao comunicar com o servidor.',
      });
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      const result = await userService.deleteUser(id);

      addToast({
        type: 'info',
        title: 'Usuário removido',
        message: `${result.user?.name || 'O usuário'} foi excluído do sistema.`,
      });

      await fetchUsers();
      await fetchStats();
      closeModal();
      return true;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Erro ao excluir',
        message: err.message || 'Falha ao processar exclusão.',
      });
      return false;
    }
  };

  const toggleStatus = async (id: string, newStatus: UserStatus): Promise<boolean> => {
    try {
      const result = await userService.updateStatus(id, newStatus);

      // Reactively update state
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus, updatedAt: new Date().toISOString() } : u))
      );
      await fetchStats();

      addToast({
        type: 'success',
        title: 'Status atualizado',
        message: result.message,
      });

      return true;
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Erro',
        message: err.message,
      });
      return false;
    }
  };

  const resetSeedData = async () => {
    try {
      const result = await userService.resetDatabase();
      addToast({
        type: 'info',
        title: 'Dados restaurados',
        message: result.message || 'A lista de usuários foi reiniciada.',
      });
      await fetchUsers();
      await fetchStats();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Erro',
        message: err.message || 'Não foi possível restaurar os dados.',
      });
    }
  };

  const setSorting = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
    setSelectedDepartment('all');
    setSelectedStatus('all');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const openModal = (type: ModalType, user?: User) => {
    setSelectedUser(user || null);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        stats,
        loading,
        error,
        isBackendConnected,
        searchQuery,
        selectedRole,
        selectedDepartment,
        selectedStatus,
        sortBy,
        sortOrder,
        viewMode,
        activeModal,
        selectedUser,
        toasts,
        fetchUsers,
        fetchStats,
        createUser,
        updateUser,
        deleteUser,
        toggleStatus,
        resetSeedData,
        setSearchQuery,
        setSelectedRole,
        setSelectedDepartment,
        setSelectedStatus,
        setSorting,
        setViewMode,
        clearFilters,
        openModal,
        closeModal,
        addToast,
        removeToast,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers deve ser usado dentro de um UserProvider');
  }
  return context;
};
