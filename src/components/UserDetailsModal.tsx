import React from 'react';
import {
  X,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useUsers } from '../context/UserContext';
import { UserStatus } from '../types';

export const UserDetailsModal: React.FC = () => {
  const { activeModal, closeModal, selectedUser, openModal, toggleStatus } = useUsers();

  if (activeModal !== 'details' || !selectedUser) return null;

  const initials = selectedUser.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const formattedCreatedAt = new Date(selectedUser.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedUpdatedAt = new Date(selectedUser.updatedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Conta Ativa
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Aguardando Aprovação
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Conta Inativa
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with avatar banner */}
        <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white/20"
              style={{ backgroundColor: selectedUser.avatarColor }}
            >
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {selectedUser.name}
                </h3>
              </div>
              <p className="text-sm text-slate-300">{selectedUser.role}</p>
              <div className="mt-2">{getStatusBadge(selectedUser.status)}</div>
            </div>
          </div>
        </div>

        {/* Details list */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                E-mail
              </span>
              <p className="font-medium text-slate-800 break-all">{selectedUser.email}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Telefone
              </span>
              <p className="font-medium text-slate-800">
                {selectedUser.phone || 'Não informado'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Cargo
              </span>
              <p className="font-medium text-slate-800">{selectedUser.role}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Departamento
              </span>
              <p className="font-medium text-slate-800">{selectedUser.department}</p>
            </div>
          </div>

          {/* Bio */}
          {selectedUser.bio && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Biografia / Observações
              </span>
              <p className="text-slate-700 whitespace-pre-wrap">{selectedUser.bio}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-100 text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Cadastrado em: <strong>{formattedCreatedAt}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Última atualização: <strong>{formattedUpdatedAt}</strong></span>
            </div>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {/* Quick status switch */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Mudar Status:</span>
            <button
              onClick={() => toggleStatus(selectedUser.id, selectedUser.status === 'active' ? 'inactive' : 'active')}
              className="text-xs font-medium text-blue-600 hover:underline cursor-pointer"
            >
              {selectedUser.status === 'active' ? 'Tornar Inativo' : 'Tornar Ativo'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('delete', selectedUser)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir</span>
            </button>
            <button
              onClick={() => openModal('edit', selectedUser)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar Usuário</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
