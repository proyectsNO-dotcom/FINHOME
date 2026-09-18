import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory } from '../../types';
import { CATEGORIES_META } from '../../data/initialData';
import { formatCurrency, formatMonth } from '../../utils/formatters';
import { calculateBudgetHealth } from '../../utils/financialCalculators';
import { CloneBudgetModal } from './CloneBudgetModal';
import { PieChart, Copy, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';

export const BudgetProgress: React.FC = () => {
  const { 
    activeSpace, 
    currentMonth, 
    currentBudget, 
    currentTransactions, 
    currentInstallments 
  } = useApp();

  const isWallet = activeSpace === 'WALLET';
  const [showCloneModal, setShowCloneModal] = useState(false);

  if (!currentBudget) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <PieChart className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
          No hay presupuesto cargado para {formatMonth(currentMonth)}
        </h3>
        <p className="text-xs text-slate-500">
          Puedes clonar el presupuesto del mes anterior con ajuste por inflación o crear uno nuevo.
        </p>
      </div>
    );
  }

  // Agrupar gastos reales y cuotas por categoría en este mes
  const categoryStats = (Object.keys(CATEGORIES_META) as ExpenseCategory[]).map(catKey => {
    const budgetConfig = currentBudget.categories[catKey] || { allocated: 0, spent: 0, committedCuotas: 0 };
    
    // Gasto directo
    const directSpent = currentTransactions
      .filter(tx => tx.type === 'EXPENSE' && tx.categoryId === catKey)
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Cuotas comprometidas de este mes en esta categoría
    const cuotasSpent = currentInstallments
      .filter(inst => inst.categoryId === catKey)
      .reduce((sum, inst) => sum + inst.amount, 0);

    const totalSpentWithCuotas = directSpent + cuotasSpent;
    const health = calculateBudgetHealth(totalSpentWithCuotas, budgetConfig.allocated);

    return {
      category: CATEGORIES_META[catKey],
      allocated: budgetConfig.allocated,
      spent: totalSpentWithCuotas,
      directSpent,
      cuotasSpent,
      health
    };
  }).filter(item => item.allocated > 0 || item.spent > 0);

  // Totales globales
  const totalAllocated = currentBudget.totalBudgeted;
  const totalExecuted = categoryStats.reduce((sum, c) => sum + c.spent, 0);
  const globalHealth = calculateBudgetHealth(totalExecuted, totalAllocated);

  return (
    <div className="space-y-4 pb-20">
      {/* Resumen Global del Presupuesto */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Presupuesto Mensual ({isWallet ? 'Mi Billetera' : 'El Hogar'})
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white block mt-0.5">
              {formatCurrency(totalExecuted)} <span className="text-sm font-semibold text-slate-400">/ {formatCurrency(totalAllocated)}</span>
            </span>
          </div>

          <button
            onClick={() => setShowCloneModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold transition active:scale-95"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Clonar +%</span>
          </button>
        </div>

        {/* Barra de progreso global semaforizada */}
        <div className="space-y-1.5">
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                globalHealth.level === 'danger'
                  ? 'bg-rose-500'
                  : globalHealth.level === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, globalHealth.percentage)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className={`flex items-center gap-1 ${
              globalHealth.level === 'danger' ? 'text-rose-600' : globalHealth.level === 'warning' ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {globalHealth.level === 'danger' && <AlertTriangle className="w-3 h-3" />}
              {globalHealth.level === 'warning' && <AlertTriangle className="w-3 h-3" />}
              {globalHealth.level === 'safe' && <CheckCircle2 className="w-3 h-3" />}
              {globalHealth.percentage}% ejecutado
            </span>
            <span className="text-slate-500">
              Disponible: {formatCurrency(globalHealth.remaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Desglose de Categorías con Semáforos */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-card space-y-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
          Control de Límites por Categoría
        </h3>

        <div className="space-y-3">
          {categoryStats.map(stat => (
            <div 
              key={stat.category.id}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                    {stat.category.label}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                    {stat.cuotasSpent > 0 && (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        Incluye {formatCurrency(stat.cuotasSpent)} en cuotas
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {formatCurrency(stat.spent)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    de {formatCurrency(stat.allocated)}
                  </span>
                </div>
              </div>

              {/* Barra de progreso de categoría */}
              <div className="space-y-1">
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      stat.health.level === 'danger'
                        ? 'bg-rose-500'
                        : stat.health.level === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, stat.health.percentage)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span className={
                    stat.health.level === 'danger' ? 'text-rose-500 font-bold' : stat.health.level === 'warning' ? 'text-amber-500 font-bold' : 'text-emerald-500 font-bold'
                  }>
                    {stat.health.percentage}%
                  </span>
                  <span>
                    {stat.health.remaining > 0 ? `Quedan ${formatCurrency(stat.health.remaining)}` : 'Límite superado'}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Modal Clonador */}
      <CloneBudgetModal
        isOpen={showCloneModal}
        onClose={() => setShowCloneModal(false)}
      />
    </div>
  );
};
