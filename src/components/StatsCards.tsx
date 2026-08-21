import React from 'react';
import { Users, UserCheck, UserX, UserPlus, Clock } from 'lucide-react';
import { useUsers } from '../context/UserContext';

export const StatsCards: React.FC = () => {
  const { stats, setSelectedStatus, selectedStatus } = useUsers();

  const total = stats?.total || 0;
  const active = stats?.active || 0;
  const inactive = stats?.inactive || 0;
  const pending = stats?.pending || 0;

  const cards = [
    {
      id: 'stat-total',
      title: 'Total de Usuários',
      value: total,
      statusKey: 'all',
      description: 'Usuários cadastrados no banco',
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    {
      id: 'stat-active',
      title: 'Usuários Ativos',
      value: active,
      statusKey: 'active',
      description: `${total > 0 ? Math.round((active / total) * 100) : 0}% da base de dados`,
      icon: UserCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    },
    {
      id: 'stat-pending',
      title: 'Pendentes',
      value: pending,
      statusKey: 'pending',
      description: 'Aguardando validação',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    },
    {
      id: 'stat-inactive',
      title: 'Inativos',
      value: inactive,
      statusKey: 'inactive',
      description: 'Acessos desabilitados',
      icon: UserX,
      color: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.statusKey;

        return (
          <div
            key={card.id}
            id={card.id}
            onClick={() => setSelectedStatus(card.statusKey)}
            className={`p-4 rounded-xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-md ${
              isSelected
                ? 'ring-2 ring-blue-600 border-transparent bg-blue-50/20'
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl border ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{card.description}</span>
              {isSelected && (
                <span className="font-semibold text-blue-600">Filtrando</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
