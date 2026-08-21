import React from 'react';
import { UserPlus, RotateCcw, Server, ShieldCheck } from 'lucide-react';
import { useUsers } from '../context/UserContext';

export const Header: React.FC = () => {
  const { openModal, resetSeedData, isBackendConnected } = useUsers();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                  Gestão de Usuários
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-950 text-blue-300 border border-blue-800/60">
                  CRUD Full-Stack
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Backend Node.js em memória &bull; Persistência com React Context &bull; TypeScript
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span>Backend:</span>
              {isBackendConnected ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Conectado (In-Memory)
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Desconectado
                </span>
              )}
            </div>

            {/* Reset data */}
            <button
              id="btn-reset-seed"
              onClick={resetSeedData}
              title="Restaurar dados de teste padrão"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Restaurar Dados</span>
            </button>

            {/* New User Button */}
            <button
              id="btn-new-user"
              onClick={() => openModal('create')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/30 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Novo Usuário</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
