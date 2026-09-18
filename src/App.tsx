import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { BottomNav, NavTab } from './components/layout/BottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { InstallmentsView } from './components/transactions/InstallmentsView';
import { BudgetProgress } from './components/budgets/BudgetProgress';
import { DollarsModule } from './components/investments/DollarsModule';
import { BrokerTransfers } from './components/investments/BrokerTransfers';
import { FixedExpenses } from './components/household/FixedExpenses';
import { ShoppingList } from './components/household/ShoppingList';
import { TransactionModal } from './components/transactions/TransactionModal';
import { NotificationsModal } from './components/notifications/NotificationsModal';
import { DollarSign, Briefcase } from 'lucide-react';

const MainApp: React.FC = () => {
  const { activeSpace } = useApp();
  const [activeTab, setActiveTab] = useState<NavTab>('resumen');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [investmentsSubTab, setInvestmentsSubTab] = useState<'dollars' | 'brokers'>('dollars');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      {/* Header Fijo con Switcher Dual */}
      <Header onOpenNotifications={() => setIsNotificationsOpen(true)} />

      {/* Contenedor Principal Mobile-First */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4">
        
        {/* Renderizado Condicional de Pantallas */}
        {activeTab === 'resumen' && (
          <DashboardView 
            onOpenQuickAdd={() => setIsQuickAddOpen(true)} 
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'cuotas' && (
          <InstallmentsView />
        )}

        {activeTab === 'presupuesto' && (
          <BudgetProgress />
        )}

        {activeTab === 'inversiones' && (
          <div className="space-y-4">
            {/* Sub-selector Dólares vs CEDEARs/Brokers */}
            <div className="flex p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => setInvestmentsSubTab('dollars')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  investmentsSubTab === 'dollars'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Dólares (PPP)</span>
              </button>
              <button
                onClick={() => setInvestmentsSubTab('brokers')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  investmentsSubTab === 'brokers'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>CEDEARs / Broker</span>
              </button>
            </div>

            {investmentsSubTab === 'dollars' ? <DollarsModule /> : <BrokerTransfers />}
          </div>
        )}

        {activeTab === 'servicios' && (
          <FixedExpenses />
        )}

        {activeTab === 'compras' && (
          <ShoppingList />
        )}
      </main>

      {/* Barra de Navegación Inferior Ergonómica */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Modales In-App */}
      <TransactionModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
