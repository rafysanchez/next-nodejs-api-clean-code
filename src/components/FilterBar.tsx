import React from 'react';
import { Search, X, Filter, LayoutGrid, LayoutList, ArrowUpDown } from 'lucide-react';
import { useUsers } from '../context/UserContext';
import { ROLES_LIST, DEPARTMENTS_LIST } from '../types';

export const FilterBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    selectedDepartment,
    setSelectedDepartment,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    sortOrder,
    setSorting,
    viewMode,
    setViewMode,
    clearFilters,
    users,
  } = useUsers();

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedRole !== 'all' ||
    selectedDepartment !== 'all' ||
    selectedStatus !== 'all' ||
    sortBy !== 'createdAt' ||
    sortOrder !== 'desc';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-search-users"
            type="text"
            placeholder="Buscar por nome, e-mail, cargo, departamento ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Role Filter */}
          <div className="flex-1 sm:flex-initial min-w-[140px]">
            <select
              id="select-role-filter"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Todos os Cargos</option>
              {ROLES_LIST.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex-1 sm:flex-initial min-w-[140px]">
            <select
              id="select-dept-filter"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Departamentos</option>
              {DEPARTMENTS_LIST.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1 sm:flex-initial min-w-[120px]">
            <select
              id="select-status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Todos Status</option>
              <option value="active">Ativos</option>
              <option value="pending">Pendentes</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              id="btn-view-table"
              onClick={() => setViewMode('table')}
              title="Visualização em Tabela"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              id="btn-view-grid"
              onClick={() => setViewMode('grid')}
              title="Visualização em Grade (Cards)"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <button
              id="btn-clear-filters"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Results indicator and quick order */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <div>
          Mostrando <span className="font-semibold text-slate-800">{users.length}</span>{' '}
          {users.length === 1 ? 'usuário encontrado' : 'usuários encontrados'}
        </div>
        <div className="flex items-center gap-2">
          <span>Ordenar por:</span>
          <button
            onClick={() => setSorting('name')}
            className={`font-medium cursor-pointer ${
              sortBy === 'name' ? 'text-blue-600 underline' : 'hover:text-slate-800'
            }`}
          >
            Nome {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <span>&bull;</span>
          <button
            onClick={() => setSorting('createdAt')}
            className={`font-medium cursor-pointer ${
              sortBy === 'createdAt' ? 'text-blue-600 underline' : 'hover:text-slate-800'
            }`}
          >
            Data de Criação {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>
    </div>
  );
};
