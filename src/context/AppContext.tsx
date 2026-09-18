import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SpaceType, 
  Transaction, 
  Installment, 
  DollarPortfolioSummary, 
  DollarTransaction, 
  BrokerTransfer, 
  MonthlyBudget, 
  FixedExpense, 
  ShoppingItem, 
  InAppNotification,
  ExpenseCategory,
  PaymentMethod,
  DollarSource,
  BrokerAsset
} from '../types';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_INSTALLMENTS, 
  INITIAL_DOLLAR_SUMMARY, 
  INITIAL_DOLLAR_TRANSACTIONS, 
  INITIAL_BROKER_TRANSFERS, 
  INITIAL_BUDGETS, 
  INITIAL_FIXED_EXPENSES, 
  INITIAL_SHOPPING_ITEMS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';
import { 
  calculateUpdatedDollarSummary, 
  generateInstallmentsSchedule, 
  cloneBudgetWithInflation 
} from '../utils/financialCalculators';
import { getCurrentPeriodMonth } from '../utils/formatters';

interface AppContextType {
  activeSpace: SpaceType;
  setActiveSpace: (space: SpaceType) => void;
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  isOnline: boolean;
  
  // Datos filtrados por mes y espacio
  currentTransactions: Transaction[];
  currentInstallments: Installment[];
  futureInstallments: Installment[];
  currentBudget: MonthlyBudget | null;
  committedMoneyCurrentMonth: number;
  
  // Dólares & Inversiones
  dollarSummary: DollarPortfolioSummary;
  dollarTransactions: DollarTransaction[];
  brokerTransfers: BrokerTransfer[];
  
  // Hogar
  fixedExpenses: FixedExpense[];
  shoppingList: ShoppingItem[];
  
  // Notificaciones
  notifications: InAppNotification[];
  unreadCount: number;
  markAllNotificationsAsRead: () => void;

  // Acciones
  addTransaction: (data: {
    type: 'EXPENSE' | 'INCOME';
    amount: number;
    description: string;
    categoryId: ExpenseCategory;
    paymentMethod: PaymentMethod;
    isInstallment: boolean;
    installmentCount?: number;
    cardName?: string;
  }) => void;
  
  addDollarTransaction: (data: {
    type: 'BUY' | 'SELL';
    usdAmount: number;
    exchangeRate: number;
    source: DollarSource;
    notes?: string;
  }) => void;

  addBrokerTransfer: (data: {
    broker: 'IOL' | 'BALANZ' | 'COCOS' | 'BULL_MARKET' | 'OTRO';
    amountArs: number;
    targetAsset: BrokerAsset;
    notes?: string;
  }) => void;

  toggleFixedExpense: (id: string) => void;
  addFixedExpense: (data: { name: string; estimatedAmount: number; dueDate: string }) => void;
  
  toggleShoppingItem: (id: string) => void;
  addShoppingItem: (item: string, category: 'supermercado' | 'verduleria' | 'farmacia' | 'otros') => void;

  cloneCurrentBudget: (inflationPct: number, targetMonth: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TRANSACTIONS: 'finhome_txs_v1',
  INSTALLMENTS: 'finhome_installments_v1',
  DOLLAR_SUMMARY: 'finhome_dollar_sum_v1',
  DOLLAR_TXS: 'finhome_dollar_txs_v1',
  BROKER: 'finhome_broker_v1',
  BUDGETS: 'finhome_budgets_v1',
  FIXED_EXPENSES: 'finhome_fixed_v1',
  SHOPPING: 'finhome_shopping_v1',
  NOTIFICATIONS: 'finhome_notifs_v1',
  SPACE: 'finhome_space_v1',
  MONTH: 'finhome_month_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSpace, setActiveSpace] = useState<SpaceType>(() => {
    return (localStorage.getItem(STORAGE_KEYS.SPACE) as SpaceType) || 'WALLET';
  });

  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.MONTH) || getCurrentPeriodMonth();
  });

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sincronizar activeSpace y currentMonth en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPACE, activeSpace);
  }, [activeSpace]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MONTH, currentMonth);
  }, [currentMonth]);

  // Estados cargados desde localStorage con fallback a datos iniciales
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [installments, setInstallments] = useState<Installment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INSTALLMENTS);
    return saved ? JSON.parse(saved) : INITIAL_INSTALLMENTS;
  });

  const [dollarSummary, setDollarSummary] = useState<DollarPortfolioSummary>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOLLAR_SUMMARY);
    return saved ? JSON.parse(saved) : INITIAL_DOLLAR_SUMMARY;
  });

  const [dollarTransactions, setDollarTransactions] = useState<DollarTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOLLAR_TXS);
    return saved ? JSON.parse(saved) : INITIAL_DOLLAR_TRANSACTIONS;
  });

  const [brokerTransfers, setBrokerTransfers] = useState<BrokerTransfer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BROKER);
    return saved ? JSON.parse(saved) : INITIAL_BROKER_TRANSFERS;
  });

  const [budgets, setBudgets] = useState<Record<string, MonthlyBudget>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FIXED_EXPENSES);
    return saved ? JSON.parse(saved) : INITIAL_FIXED_EXPENSES;
  });

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHOPPING);
    return saved ? JSON.parse(saved) : INITIAL_SHOPPING_ITEMS;
  });

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Guardar en localStorage ante cada cambio
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INSTALLMENTS, JSON.stringify(installments)); }, [installments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DOLLAR_SUMMARY, JSON.stringify(dollarSummary)); }, [dollarSummary]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DOLLAR_TXS, JSON.stringify(dollarTransactions)); }, [dollarTransactions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BROKER, JSON.stringify(brokerTransfers)); }, [brokerTransfers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FIXED_EXPENSES, JSON.stringify(fixedExpenses)); }, [fixedExpenses]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SHOPPING, JSON.stringify(shoppingList)); }, [shoppingList]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); }, [notifications]);

  // Cálculos derivados del mes y espacio actual
  const currentTransactions = transactions.filter(
    tx => tx.space === activeSpace && tx.periodMonth === currentMonth
  );

  const currentInstallments = installments.filter(
    inst => inst.space === activeSpace && inst.targetMonth === currentMonth
  );

  const futureInstallments = installments.filter(
    inst => inst.space === activeSpace && inst.targetMonth > currentMonth
  );

  const committedMoneyCurrentMonth = currentInstallments.reduce((acc, inst) => acc + inst.amount, 0);

  const budgetKey = `${activeSpace}_${currentMonth}`;
  const currentBudget = budgets[budgetKey] || null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // 1. Registro de transacción con generación automática de Cuotas
  const addTransaction = (data: {
    type: 'EXPENSE' | 'INCOME';
    amount: number;
    description: string;
    categoryId: ExpenseCategory;
    paymentMethod: PaymentMethod;
    isInstallment: boolean;
    installmentCount?: number;
    cardName?: string;
  }) => {
    const planId = `plan_${Date.now()}`;
    const txId = `tx_${Date.now()}`;
    const nowISO = new Date().toISOString().split('T')[0];

    const newTx: Transaction = {
      id: txId,
      type: data.type,
      amount: data.amount,
      description: data.description,
      categoryId: data.categoryId,
      paymentMethod: data.paymentMethod,
      space: activeSpace,
      isInstallment: data.isInstallment,
      installmentDetails: data.isInstallment ? {
        totalInstallments: data.installmentCount || 1,
        installmentAmount: Math.round(data.amount / (data.installmentCount || 1)),
        planId
      } : undefined,
      date: nowISO,
      periodMonth: currentMonth,
      createdByUid: 'user_nico',
      createdByName: 'Nico'
    };

    setTransactions(prev => [newTx, ...prev]);

    // Si es en cuotas, proyectar automáticamente en los meses futuros
    if (data.isInstallment && data.installmentCount && data.installmentCount > 1) {
      const projected = generateInstallmentsSchedule({
        planId,
        description: data.description,
        totalAmount: data.amount,
        totalInstallments: data.installmentCount,
        startPeriodMonth: currentMonth,
        categoryId: data.categoryId,
        cardName: data.cardName || 'Tarjeta de Crédito',
        space: activeSpace,
        createdByUid: 'user_nico'
      });

      setInstallments(prev => [...prev, ...projected]);

      // Alerta in-app de cuotas generadas
      const newNotif: InAppNotification = {
        id: `notif_${Date.now()}`,
        type: 'PAYMENT_REGISTERED',
        title: 'Plan de cuotas proyectado',
        message: `Se comprometieron $${Math.round(data.amount / data.installmentCount).toLocaleString('es-AR')} por ${data.installmentCount} meses para "${data.description}".`,
        read: false,
        timestamp: 'Recién'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // 2. Registro de Dólares con recálculo atómico de PPP
  const addDollarTransaction = (data: {
    type: 'BUY' | 'SELL';
    usdAmount: number;
    exchangeRate: number;
    source: DollarSource;
    notes?: string;
  }) => {
    const txId = `usd_${Date.now()}`;
    const newTx: DollarTransaction = {
      id: txId,
      type: data.type,
      usdAmount: data.usdAmount,
      exchangeRate: data.exchangeRate,
      totalArsCost: data.usdAmount * data.exchangeRate,
      source: data.source,
      notes: data.notes,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedSummary = calculateUpdatedDollarSummary(dollarSummary, newTx);
    setDollarSummary(updatedSummary);
    setDollarTransactions(prev => [newTx, ...prev]);

    // Alerta in-app
    const newNotif: InAppNotification = {
      id: `notif_${Date.now()}`,
      type: 'PAYMENT_REGISTERED',
      title: data.type === 'BUY' ? 'Compra de Dólares registrada' : 'Venta de Dólares',
      message: `${data.type === 'BUY' ? 'Compraste' : 'Vendiste'} USD ${data.usdAmount} a $${data.exchangeRate}. Nuevo PPP: $${updatedSummary.weightedAveragePrice}.`,
      read: false,
      timestamp: 'Recién'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 3. Registro de Transferencias a Brokers
  const addBrokerTransfer = (data: {
    broker: 'IOL' | 'BALANZ' | 'COCOS' | 'BULL_MARKET' | 'OTRO';
    amountArs: number;
    targetAsset: BrokerAsset;
    notes?: string;
  }) => {
    const newTransfer: BrokerTransfer = {
      id: `brk_${Date.now()}`,
      broker: data.broker,
      amountArs: data.amountArs,
      targetAsset: data.targetAsset,
      date: new Date().toISOString().split('T')[0],
      periodMonth: currentMonth,
      notes: data.notes
    };
    setBrokerTransfers(prev => [newTransfer, ...prev]);
  };

  // 4. Checklist del Hogar: Toggle de Pago Fijo
  const toggleFixedExpense = (id: string) => {
    setFixedExpenses(prev => prev.map(item => {
      if (item.id === id) {
        const nextPaid = !item.isPaid;
        if (nextPaid) {
          // Generar notificación in-app social
          const notif: InAppNotification = {
            id: `notif_${Date.now()}`,
            type: 'PAYMENT_REGISTERED',
            title: 'Servicio pagado en El Hogar',
            message: `Nico marcó como pagado "${item.name}".`,
            read: false,
            timestamp: 'Recién'
          };
          setNotifications(n => [notif, ...n]);
        }
        return {
          ...item,
          isPaid: nextPaid,
          paidByUid: nextPaid ? 'user_nico' : undefined,
          paidByName: nextPaid ? 'Nico' : undefined,
          paidAt: nextPaid ? new Date().toISOString() : undefined
        };
      }
      return item;
    }));
  };

  const addFixedExpense = (data: { name: string; estimatedAmount: number; dueDate: string }) => {
    const newItem: FixedExpense = {
      id: `fix_${Date.now()}`,
      name: data.name,
      estimatedAmount: data.estimatedAmount,
      dueDate: data.dueDate,
      periodMonth: currentMonth,
      isPaid: false
    };
    setFixedExpenses(prev => [...prev, newItem]);
  };

  // 5. Lista de compras reactiva
  const toggleShoppingItem = (id: string) => {
    setShoppingList(prev => prev.map(item => {
      if (item.id === id) {
        const nextCompleted = !item.isCompleted;
        if (nextCompleted) {
          const notif: InAppNotification = {
            id: `notif_${Date.now()}`,
            type: 'TASK_COMPLETED',
            title: 'Compra realizada',
            message: `Nico tachó "${item.item}" de la lista del Hogar.`,
            read: false,
            timestamp: 'Recién'
          };
          setNotifications(n => [notif, ...n]);
        }
        return {
          ...item,
          isCompleted: nextCompleted,
          completedByUid: nextCompleted ? 'user_nico' : undefined,
          completedByName: nextCompleted ? 'Nico' : undefined
        };
      }
      return item;
    }));
  };

  const addShoppingItem = (item: string, category: 'supermercado' | 'verduleria' | 'farmacia' | 'otros') => {
    const newItem: ShoppingItem = {
      id: `shop_${Date.now()}`,
      item,
      category,
      isCompleted: false,
      addedByUid: 'user_nico',
      addedByName: 'Nico',
      createdAt: new Date().toISOString()
    };
    setShoppingList(prev => [newItem, ...prev]);
  };

  // 6. Clonador de Presupuesto con Ajuste Anti-Inflación
  const cloneCurrentBudget = (inflationPct: number, targetMonth: string) => {
    if (!currentBudget) return;
    const cloned = cloneBudgetWithInflation(currentBudget, targetMonth, inflationPct);
    const newKey = `${activeSpace}_${targetMonth}`;
    setBudgets(prev => ({
      ...prev,
      [newKey]: cloned
    }));

    const notif: InAppNotification = {
      id: `notif_${Date.now()}`,
      type: 'BUDGET_EXCEEDED',
      title: 'Presupuesto Clonado con Ajuste',
      message: `Presupuesto de ${targetMonth} creado con +${inflationPct}% por inflación ($${cloned.totalBudgeted.toLocaleString('es-AR')}).`,
      read: false,
      timestamp: 'Recién'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      activeSpace,
      setActiveSpace,
      currentMonth,
      setCurrentMonth,
      isOnline,
      currentTransactions,
      currentInstallments,
      futureInstallments,
      currentBudget,
      committedMoneyCurrentMonth,
      dollarSummary,
      dollarTransactions,
      brokerTransfers,
      fixedExpenses,
      shoppingList,
      notifications,
      unreadCount,
      markAllNotificationsAsRead,
      addTransaction,
      addDollarTransaction,
      addBrokerTransfer,
      toggleFixedExpense,
      addFixedExpense,
      toggleShoppingItem,
      addShoppingItem,
      cloneCurrentBudget
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
