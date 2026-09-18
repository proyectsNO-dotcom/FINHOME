import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatMonth, getNextMonth } from '../../utils/formatters';
import { CreditCard, Calendar, AlertCircle, ArrowRight } from 'lucide-react';

export const InstallmentsView: React.FC = () => {
  const { 
    activeSpace, 
    currentMonth, 
    currentInstallments, 
    futureInstallments, 
    committedMoneyCurrentMonth 
  } = useApp();

  const isWallet = activeSpace === 'WALLET';

  // Agrupar cuotas futuras por mes
  const monthsAhead = [1, 2, 3, 4, 5, 6].map(offset => getNextMonth(currentMonth, offset));
  
  const futureMonthlyTotals = monthsAhead.map(month => {
    const monthInsts = futureInstallments.filter(i => i.targetMonth === month);
    const total = monthInsts.reduce((sum, i) => sum + i.amount, 0);
    return {
      month,
      total,
      count: monthInsts.length
    };
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Banner Principal de Dinero Comprometido */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20">
        <div className="flex items-center justify-between opacity-90 text-xs font-semibold mb-1">
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4" />
            Dinero Comprometido en Cuotas
          </span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
            {isWallet ? 'Mi Billetera' : 'El Hogar'}
          </span>
        </div>
        
        <h2 className="text-3xl font-extrabold tracking-tight">
          {formatCurrency(committedMoneyCurrentMonth)}
        </h2>
        
        <p className="text-xs text-amber-100 mt-2 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          A pagar durante {formatMonth(currentMonth)} en {currentInstallments.length} compras diferidas.
        </p>
      </div>

      {/* Proyección Temporal (Meses Futuros) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Proyección Futura</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">
              Próximos 6 meses
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {futureMonthlyTotals.map((item, idx) => (
            <div 
              key={item.month} 
              className={`p-3 rounded-2xl border text-center transition-all ${
                item.total > 0
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
              }`}
            >
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
                {formatMonth(item.month).split(' ')[0]}
              </span>
              <span className={`text-xs font-extrabold block mt-1 ${
                item.total > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
              }`}>
                {item.total > 0 ? formatCurrency(item.total) : '$ 0'}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                {item.count > 0 ? `${item.count} cuota${item.count > 1 ? 's' : ''}` : 'Libre'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Listado de Cuotas de Este Mes */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-3">
          Cuotas a Pagar este Mes ({currentInstallments.length})
        </h3>

        {currentInstallments.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No tienes cuotas pendientes para este mes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentInstallments.map(inst => {
              const progressPct = Math.round((inst.installmentNumber / inst.totalInstallments) * 100);
              return (
                <div 
                  key={inst.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                        {inst.description}
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <CreditCard className="w-3 h-3" />
                        {inst.cardName}
                      </span>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white block">
                        {formatCurrency(inst.amount)}
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                        Cuota {inst.installmentNumber} de {inst.totalInstallments}
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progreso del Plan de Cuotas */}
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>Progreso del plan</span>
                      <span>{progressPct}% pagado</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
