import React from 'react';
import {
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useUsers } from '../context/UserContext';
import { User, UserStatus } from '../types';

export const UserTable: React.FC = () => {
  const { users, loading, error, openModal, toggleStatus, sortBy, sortOrder, setSorting } = useUsers();

  const getStatusBadge = (status: UserStatus, userId: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Ativo
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pendente
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Inativo
          </span>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      Administrador: 'bg-purple-50 text-purple-700 border-purple-200',
      Desenvolvedor: 'bg-blue-50 text-blue-700 border-blue-200',
      Designer: 'bg-pink-50 text-pink-700 border-pink-200',
      'Gerente de Produto': 'bg-amber-50 text-amber-700 border-amber-200',
      Analista: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      Suporte: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    };

    const colorClass = roleColors[role] || 'bg-slate-50 text-slate-700 border-slate-200';

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}>
        {role}
      </span>
    );
  };

  if (loading && users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-xs">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-r-transparent mb-3"></div>
        <p className="text-sm font-medium text-slate-600">Carregando usuários do backend...</p>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-rose-200 p-8 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <XCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Falha ao carregar dados</h3>
        <p className="text-sm text-slate-500 mt-1">{error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <UserCheck className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">Nenhum usuário encontrado</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Não encontramos nenhum registro correspondente aos filtros atuais. Tente alterar ou limpar os filtros de busca.
        </p>
        <button
          onClick={() => openModal('create')}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer"
        >
          Adicionar Novo Usuário
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 sm:pl-6 cursor-pointer hover:text-slate-800 transition-colors"
                onClick={() => setSorting('name')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Usuário</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th scope="col" className="px-3 py-3.5">
                Cargo & Depto
              </th>
              <th scope="col" className="px-3 py-3.5">
                Contato
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 cursor-pointer hover:text-slate-800 transition-colors"
                onClick={() => setSorting('status')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 hidden lg:table-cell cursor-pointer hover:text-slate-800 transition-colors"
                onClick={() => setSorting('createdAt')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Cadastro</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                Ações CRUD
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {users.map((user) => {
              const initials = user.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              const formattedDate = new Date(user.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });

              return (
                <tr
                  key={user.id}
                  id={`user-row-${user.id}`}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* User Avatar + Name */}
                  <td className="py-4 pl-4 pr-3 sm:pl-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0"
                        style={{ backgroundColor: user.avatarColor }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <button
                          onClick={() => openModal('details', user)}
                          className="text-left font-semibold text-slate-900 hover:text-blue-600 truncate block cursor-pointer"
                        >
                          {user.name}
                        </button>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role & Dept */}
                  <td className="px-3 py-4">
                    <div className="space-y-1">
                      <div>{getRoleBadge(user.role)}</div>
                      <div className="text-xs text-slate-500 font-medium">{user.department}</div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-3 py-4">
                    <div className="text-xs text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{user.phone || 'Não informado'}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(user.status, user.id)}
                      
                      {/* Quick Status toggle dropdown */}
                      <select
                        aria-label="Alterar status"
                        value={user.status}
                        onChange={(e) => toggleStatus(user.id, e.target.value as UserStatus)}
                        className="text-[11px] font-medium text-slate-500 bg-transparent border-0 hover:text-slate-800 cursor-pointer p-0 focus:ring-0 focus:outline-none"
                      >
                        <option value="active">Ativar</option>
                        <option value="pending">Pendente</option>
                        <option value="inactive">Inativar</option>
                      </select>
                    </div>
                  </td>

                  {/* Created At */}
                  <td className="px-3 py-4 text-xs text-slate-500 hidden lg:table-cell">
                    {formattedDate}
                  </td>

                  {/* Actions */}
                  <td className="py-4 pl-3 pr-4 sm:pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View details */}
                      <button
                        id={`btn-view-${user.id}`}
                        onClick={() => openModal('details', user)}
                        title="Ver Detalhes do Usuário"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        id={`btn-edit-${user.id}`}
                        onClick={() => openModal('edit', user)}
                        title="Editar Usuário"
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        id={`btn-delete-${user.id}`}
                        onClick={() => openModal('delete', user)}
                        title="Excluir Usuário"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
