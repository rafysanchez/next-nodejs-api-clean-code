import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useUsers } from '../context/UserContext';

export const DeleteConfirmModal: React.FC = () => {
  const { activeModal, closeModal, selectedUser, deleteUser } = useUsers();
  const [isDeleting, setIsDeleting] = useState(false);

  if (activeModal !== 'delete' || !selectedUser) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUser(selectedUser.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Confirmar Exclusão
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Tem certeza de que deseja excluir o usuário{' '}
            <strong className="text-slate-800 font-semibold">{selectedUser.name}</strong>?
          </p>
          <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 text-left">
            <p><strong>E-mail:</strong> {selectedUser.email}</p>
            <p><strong>Cargo:</strong> {selectedUser.role} ({selectedUser.department})</p>
          </div>
          <p className="text-xs text-rose-500 mt-3 font-medium">
            Esta ação removerá o registro da memória do backend.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            id="btn-confirm-delete"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-lg shadow-sm shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-r-transparent rounded-full animate-spin"></span>
                <span>Excluindo...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
