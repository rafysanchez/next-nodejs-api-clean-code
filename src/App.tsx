import React from 'react';
import { UserProvider, useUsers } from './context/UserContext';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { UserTable } from './components/UserTable';
import { UserGrid } from './components/UserGrid';
import { UserFormModal } from './components/UserFormModal';
import { UserDetailsModal } from './components/UserDetailsModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastContainer } from './components/ToastContainer';
import { Sparkles, Database, Layers, Code, RefreshCw } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { viewMode, fetchUsers, loading } = useUsers();

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Metric Cards */}
        <section aria-label="Estatísticas gerais">
          <StatsCards />
        </section>

        {/* Filters and Search */}
        <section aria-label="Filtros e busca">
          <FilterBar />
        </section>

        {/* User List: Table or Grid */}
        <section aria-label="Lista de usuários">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>Registros de Usuários</span>
              {loading && (
                <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
              )}
            </h2>
            <button
              onClick={() => fetchUsers()}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Recarregar lista</span>
            </button>
          </div>

          {viewMode === 'table' ? <UserTable /> : <UserGrid />}
        </section>

        {/* Architecture & Stack details banner */}
        <section className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Estrutura e Recursos do Sistema</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                <Database className="w-3.5 h-3.5 text-blue-500" />
                <span>Backend Node.js</span>
              </div>
              <p className="text-slate-500">
                Rotas RESTful completas no Express para criação, leitura, atualização, exclusão e alteração de status.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Dados In-Memory</span>
              </div>
              <p className="text-slate-500">
                Armazenamento volátil e ultra-rápido na memória do servidor com opção de restauração dos dados padrão.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>React Context</span>
              </div>
              <p className="text-slate-500">
                Gerenciamento global de estado, cache reativo, notificações Toast e controle centralizado de formulários.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                <Code className="w-3.5 h-3.5 text-purple-500" />
                <span>TypeScript & Tailwind</span>
              </div>
              <p className="text-slate-500">
                Tipagem estrita de ponta a ponta (front e back) com interface moderna e responsiva.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modals & Toasts */}
      <UserFormModal />
      <UserDetailsModal />
      <DeleteConfirmModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <UserProvider>
      <DashboardContent />
    </UserProvider>
  );
}
