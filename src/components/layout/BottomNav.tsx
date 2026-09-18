import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  CreditCard, 
  PieChart, 
  TrendingUp, 
  CheckSquare, 
  ShoppingCart, 
  Plus 
} from 'lucide-react';

export type NavTab = 'resumen' | 'cuotas' | 'presupuesto' | 'inversiones' | 'servicios' | 'compras';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenQuickAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onOpenQuickAdd }) => {
  const { activeSpace, committedMoneyCurrentMonth, fixedExpenses, shoppingList } = useApp();
  const isWallet = activeSpace === 'WALLET';

  // Contadores para badges en los tabs
  const pendingServicesCount = fixedExpenses.filter(f => !f.isPaid).length;
  const pendingShoppingCount = shoppingList.filter(s => !s.isCompleted).length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 pb-safe shadow-bottom-nav">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        
        {/* Tab 1: Resumen */}
        <button
          onClick={() => setActiveTab('resumen')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'resumen'
              ? isWallet ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105' : 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-1">Inicio</span>
        </button>

        {/* Tab 2: Cuotas (Billetera) o Servicios Fijos (Hogar) */}
        {isWallet ? (
          <button
            onClick={() => setActiveTab('cuotas')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
              activeTab === 'cuotas'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-[10px] mt-1">Cuotas</span>
            {committedMoneyCurrentMonth > 0 && (
              <span className="absolute top-0 right-3 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('servicios')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
              activeTab === 'servicios'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-[10px] mt-1">Servicios</span>
            {pendingServicesCount > 0 && (
              <span className="absolute top-0 right-3 px-1 min-w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-900">
                {pendingServicesCount}
              </span>
            )}
          </button>
        )}

        {/* Botón Central Flotante (+) Ergonomía Touch */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onOpenQuickAdd}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transform active:scale-90 transition-all duration-200 ring-4 ring-white dark:ring-slate-900 ${
              isWallet
                ? 'bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-indigo-500/40 hover:shadow-indigo-500/60'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/40 hover:shadow-emerald-500/60'
            }`}
            aria-label="Registrar gasto o ingreso"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 3: Presupuesto (Billetera) o Compras (Hogar) */}
        {isWallet ? (
          <button
            onClick={() => setActiveTab('presupuesto')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'presupuesto'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span className="text-[10px] mt-1">Límites</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('compras')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
              activeTab === 'compras'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[10px] mt-1">Compras</span>
            {pendingShoppingCount > 0 && (
              <span className="absolute top-0 right-3 px-1 min-w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900">
                {pendingShoppingCount}
              </span>
            )}
          </button>
        )}

        {/* Tab 4: Inversiones (Billetera) o Presupuesto Compartido (Hogar) */}
        {isWallet ? (
          <button
            onClick={() => setActiveTab('inversiones')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'inversiones'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] mt-1">Dólares</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('presupuesto')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'presupuesto'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span className="text-[10px] mt-1">Presupuesto</span>
          </button>
        )}

      </div>
    </nav>
  );
};
