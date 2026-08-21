import React from 'react';
import { Eye, Edit2, Trash2, Phone, Mail, Calendar, Briefcase, Building } from 'lucide-react';
import { useUsers } from '../context/UserContext';
import { User, UserStatus } from '../types';

export const UserGrid: React.FC = () => {
  const { users, openModal, toggleStatus } = useUsers();

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Ativo
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Pendente
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Inativo
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div
            key={user.id}
            id={`user-card-${user.id}`}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header with Avatar & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h4
                      onClick={() => openModal('details', user)}
                      className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer text-base line-clamp-1"
                    >
                      {user.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">{user.role}</p>
                  </div>
                </div>
                <div>{getStatusBadge(user.status)}</div>
              </div>

              {/* Details */}
              <div className="mt-4 space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{user.phone || 'Não informado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Departamento: {user.department}</span>
                </div>
                {user.bio && (
                  <p className="text-xs text-slate-500 italic line-clamp-2 pt-1">
                    "{user.bio}"
                  </p>
                )}
              </div>
            </div>

            {/* Footer and Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Criado em {formattedDate}</span>
              <div className="flex items-center gap-1">
                <button
                  id={`btn-card-view-${user.id}`}
                  onClick={() => openModal('details', user)}
                  title="Ver Detalhes"
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  id={`btn-card-edit-${user.id}`}
                  onClick={() => openModal('edit', user)}
                  title="Editar"
                  className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  id={`btn-card-delete-${user.id}`}
                  onClick={() => openModal('delete', user)}
                  title="Excluir"
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
