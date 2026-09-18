import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES_META } from '../../data/initialData';
import { formatCurrency, formatMonth } from '../../utils/formatters';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  CreditCard, 
  Plus, 
  Wallet, 
  Home, 
  TrendingUp,
  Receipt,
  ChevronRight 
} from 'lucide-react';
import { NavTab } from '../layout/BottomNav';

interface DashboardViewProps {
  onOpenQuickAdd: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenQuickAdd, onNavigateTab }) => {
  const { 
    activeSpace, 
    currentMonth, 
    currentTransactions, 
    committedMoneyCurrentMonth,
    dollarSummary,
    fixedExpenses,
    shoppingList
  } = useApp();

  const isWallet = activeSpace === 'WALLET';

  // Calcular totales del mes
  const totalExpenses = currentTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = currentTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingFixedExpenses = fixedExpenses.filter(f => !f.isPaid);
  const pendingShopping = shoppingList.filter(s => !s.isCompleted);

  return (
    <div className="space-y-4 pb-20">
      {/* TARJETA PRINCIPAL DEL MES */}
      <div className={`p-6 rounded-3xl text-white shadow-xl relative overflow-hidden transition-all duration-300 ${
        isWallet
          ? 'bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 shadow-indigo-500/25'
          : 'bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-900 shadow-emerald-500/25'
      }`}>
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between opacity-90 text-xs font-semibold mb-2">
          <span className="flex items-center gap-1.5">
            {isWallet ? <Wallet className="w-4 h-4" /> : <Home className="w-4 h-4" />}
            {isWallet ? 'Egresos Mi Billetera' : 'Gastos del Hogar'}
          </span>
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide">
            {formatMonth(currentMonth)}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          {formatCurrency(totalExpenses)}
        </h2>

        {/* Subtotales en dos columnas */}
        <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-white/70 block text-[10px] font-semibold">
              {isWallet ? 'Ingresos Registrados' : 'Servicios Pendientes'}
            </span>
            <span className="font-extrabold text-sm text-white block mt-0.5">
              {isWallet ? formatCurrency(totalIncome) : `${pendingFixedExpenses.length} por pagar`}
            </span>
          </div>

          <div>
            <span className="text-white/70 block text-[10px] font-semibold">
              {isWallet ? 'Cuotas este Mes' : 'Faltantes en Casa'}
            </span>
            <span className="font-extrabold text-sm text-white block mt-0.5">
              {isWallet ? formatCurrency(committedMoneyCurrentMonth) : `${pendingShopping.length} productos`}
            </span>
          </div>
        </div>
      </div>

      {/* ACCESOS RÁPIDOS ERGONÓMICOS */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onOpenQuickAdd}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card hover:border-indigo-300 dark:hover:border-indigo-700 flex items-center gap-3 transition active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
              Nuevo Gasto
            </span>
            <span className="text-[10px] text-slate-400">
              Con pre-clasificador
            </span>
          </div>
        </button>

        {isWallet ? (
          <button
            onClick={() => onNavigateTab('inversiones')}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card hover:border-emerald-300 dark:hover:border-emerald-700 flex items-center gap-3 transition active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                Dólares & PPP
              </span>
              <span className="text-[10px] text-slate-400 truncate block max-w-[90px]">
                USD {dollarSummary.totalUsdHeld}
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={() => onNavigateTab('servicios')}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card hover:border-teal-300 dark:hover:border-teal-700 flex items-center gap-3 transition active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                Servicios Hogar
              </span>
              <span className="text-[10px] text-slate-400">
                Checklist mensual
              </span>
            </div>
          </button>
        )}
      </div>

      {/* BANNER DINERO COMPROMETIDO EN CUOTAS */}
      {committedMoneyCurrentMonth > 0 && (
        <div 
          onClick={() => onNavigateTab('cuotas')}
          className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between cursor-pointer hover:border-amber-300 transition select-none active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                {formatCurrency(committedMoneyCurrentMonth)} comprometidos en cuotas
              </span>
              <span className="text-[11px] text-amber-700 dark:text-amber-400 block mt-0.5">
                Impacta el presupuesto de {formatMonth(currentMonth)}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
      )}

      {/* HISTORIAL RECIENTE DE TRANSACCIONES */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            Movimientos del Mes ({currentTransactions.length})
          </h3>
        </div>

        {currentTransactions.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            Aún no hay movimientos registrados para este mes.
          </p>
        ) : (
          <div className="space-y-2.5">
            {currentTransactions.map(tx => {
              const meta = CATEGORIES_META[tx.categoryId] || CATEGORIES_META.otros;
              const isExpense = tx.type === 'EXPENSE';
              return (
                <div 
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      isExpense 
                        ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' 
                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                    }`}>
                      {isExpense ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {tx.description}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                        <span>{meta.label}</span>
                        {tx.isInstallment && tx.installmentDetails && (
                          <span className="px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold rounded">
                            {tx.installmentDetails.totalInstallments} cuotas
                          </span>
                        )}
                        <span>• {tx.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-extrabold block ${
                      isExpense ? 'text-slate-900 dark:text-white' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {isExpense ? '-' : '+'}{formatCurrency(tx.amount)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {tx.paymentMethod}
                    </span>
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
