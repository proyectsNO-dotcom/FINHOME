import { 
  ExpenseCategory,
  CategoryItem, 
  Transaction, 
  Installment, 
  DollarPortfolioSummary, 
  DollarTransaction, 
  BrokerTransfer, 
  MonthlyBudget, 
  FixedExpense, 
  ShoppingItem, 
  InAppNotification 
} from '../types';
import { getCurrentPeriodMonth, getNextMonth, getPreviousMonth } from '../utils/formatters';

export const INITIAL_EXPENSE_CATEGORIES: CategoryItem[] = [
  {
    id: 'supermercado',
    label: 'Supermercado & Almacén',
    type: 'EXPENSE',
    iconName: 'ShoppingCart',
    icon: '🛒',
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  {
    id: 'servicios',
    label: 'Luz, Gas, Agua e Internet',
    type: 'EXPENSE',
    iconName: 'Zap',
    icon: '💡',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    id: 'alquiler_expensas',
    label: 'Alquiler & Expensas',
    type: 'EXPENSE',
    iconName: 'Home',
    icon: '🏠',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  },
  {
    id: 'salidas_ocio',
    label: 'Salidas, Bares & Delivery',
    type: 'EXPENSE',
    iconName: 'Coffee',
    icon: '🍕',
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  {
    id: 'ropa_calzado',
    label: 'Ropa & Calzado',
    type: 'EXPENSE',
    iconName: 'ShoppingBag',
    icon: '👕',
    color: 'bg-pink-100 text-pink-700 border-pink-200'
  },
  {
    id: 'salud_farmacia',
    label: 'Salud, Remedios & Prepaga',
    type: 'EXPENSE',
    iconName: 'HeartPulse',
    icon: '💊',
    color: 'bg-red-100 text-red-700 border-red-200'
  },
  {
    id: 'transporte_auto',
    label: 'Combustible, SUBE & Auto',
    type: 'EXPENSE',
    iconName: 'Car',
    icon: '🚗',
    color: 'bg-slate-100 text-slate-700 border-slate-200'
  },
  {
    id: 'educacion',
    label: 'Cursos, Libros & Educación',
    type: 'EXPENSE',
    iconName: 'GraduationCap',
    icon: '📚',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  },
  {
    id: 'tecnologia_hogar',
    label: 'Electro & Muebles Hogar',
    type: 'EXPENSE',
    iconName: 'Tv',
    icon: '💻',
    color: 'bg-teal-100 text-teal-700 border-teal-200'
  },
  {
    id: 'otros',
    label: 'Otros Gastos Varios',
    type: 'EXPENSE',
    iconName: 'MoreHorizontal',
    icon: '📦',
    color: 'bg-gray-100 text-gray-700 border-gray-200'
  }
];

export const INITIAL_INCOME_CATEGORIES: CategoryItem[] = [
  {
    id: 'sueldo_principal',
    label: 'Sueldo / Salario Principal',
    type: 'INCOME',
    iconName: 'Briefcase',
    icon: '💼',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  },
  {
    id: 'freelance_honorarios',
    label: 'Honorarios / Freelance',
    type: 'INCOME',
    iconName: 'Laptop',
    icon: '💻',
    color: 'bg-cyan-100 text-cyan-700 border-cyan-200'
  },
  {
    id: 'aguinaldo_sac',
    label: 'Aguinaldo (SAC)',
    type: 'INCOME',
    iconName: 'Gift',
    icon: '🎁',
    color: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  {
    id: 'alquileres_cobrados',
    label: 'Rentas / Alquiler Cobrado',
    type: 'INCOME',
    iconName: 'Building',
    icon: '🏢',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  },
  {
    id: 'ventas_usados',
    label: 'Venta de Bienes / Usados',
    type: 'INCOME',
    iconName: 'Tag',
    icon: '🏷️',
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  {
    id: 'rendimientos_inversiones',
    label: 'Dividendos & Rendimientos',
    type: 'INCOME',
    iconName: 'TrendingUp',
    icon: '📈',
    color: 'bg-teal-100 text-teal-700 border-teal-200'
  },
  {
    id: 'reintegros_devoluciones',
    label: 'Reintegros / Reembolsos',
    type: 'INCOME',
    iconName: 'RotateCcw',
    icon: '🔄',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    id: 'otros_ingresos',
    label: 'Otros Ingresos',
    type: 'INCOME',
    iconName: 'PlusCircle',
    icon: '💰',
    color: 'bg-gray-100 text-gray-700 border-gray-200'
  }
];

export const CATEGORIES_META: Record<string, CategoryItem> = [
  ...INITIAL_EXPENSE_CATEGORIES,
  ...INITIAL_INCOME_CATEGORIES
].reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {} as Record<string, CategoryItem>);

const currentMonth = getCurrentPeriodMonth();
const prevMonth = getPreviousMonth(currentMonth);
const nextMonth1 = getNextMonth(currentMonth, 1);
const nextMonth2 = getNextMonth(currentMonth, 2);

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    type: 'EXPENSE',
    amount: 54200,
    description: 'Coto Abasto - Compra semanal',
    categoryId: 'supermercado',
    paymentMethod: 'DEBIT',
    space: 'WALLET',
    isInstallment: false,
    date: `${currentMonth}-08`,
    periodMonth: currentMonth,
    createdByUid: 'user_nico',
    createdByName: 'Nico'
  },
  {
    id: 'tx_2',
    type: 'EXPENSE',
    amount: 38000,
    description: 'YPF Nafta Infinia',
    categoryId: 'transporte_auto',
    paymentMethod: 'DEBIT',
    space: 'WALLET',
    isInstallment: false,
    date: `${currentMonth}-11`,
    periodMonth: currentMonth,
    createdByUid: 'user_nico',
    createdByName: 'Nico'
  },
  {
    id: 'tx_3',
    type: 'EXPENSE',
    amount: 19500,
    description: 'Farmacity Recetas',
    categoryId: 'salud_farmacia',
    paymentMethod: 'TRANSFER',
    space: 'WALLET',
    isInstallment: false,
    date: `${currentMonth}-14`,
    periodMonth: currentMonth,
    createdByUid: 'user_nico',
    createdByName: 'Nico'
  },
  {
    id: 'tx_4',
    type: 'INCOME',
    amount: 1650000,
    description: 'Sueldo Mensual',
    categoryId: 'sueldo_principal',
    paymentMethod: 'TRANSFER',
    space: 'WALLET',
    isInstallment: false,
    date: `${currentMonth}-01`,
    periodMonth: currentMonth,
    createdByUid: 'user_nico',
    createdByName: 'Nico'
  },
  // Gastos del Hogar
  {
    id: 'tx_5',
    type: 'EXPENSE',
    amount: 135000,
    description: 'Jumbo Mayorista Alimentos',
    categoryId: 'supermercado',
    paymentMethod: 'DEBIT',
    space: 'HOUSEHOLD',
    isInstallment: false,
    date: `${currentMonth}-04`,
    periodMonth: currentMonth,
    createdByUid: 'user_nico',
    createdByName: 'Nico'
  },
  {
    id: 'tx_6',
    type: 'EXPENSE',
    amount: 88000,
    description: 'Expensas Depto',
    categoryId: 'alquiler_expensas',
    paymentMethod: 'TRANSFER',
    space: 'HOUSEHOLD',
    isInstallment: false,
    date: `${currentMonth}-09`,
    periodMonth: currentMonth,
    createdByUid: 'user_flor',
    createdByName: 'Flor'
  }
];

// Cuotas activas demostrativas (Dinero Comprometido)
export const INITIAL_INSTALLMENTS: Installment[] = [
  // Zapatillas Adidas (3 de 6 cuotas) en Billetera
  {
    id: 'inst_zapa_1',
    planId: 'plan_zapatillas',
    description: 'Zapatillas Adidas Running (1/6)',
    installmentNumber: 1,
    totalInstallments: 6,
    amount: 25000,
    targetMonth: prevMonth,
    categoryId: 'ropa_calzado',
    cardName: 'Visa Santander',
    status: 'PAID',
    space: 'WALLET',
    createdByUid: 'user_nico',
    createdAt: `${prevMonth}-01`
  },
  {
    id: 'inst_zapa_2',
    planId: 'plan_zapatillas',
    description: 'Zapatillas Adidas Running (2/6)',
    installmentNumber: 2,
    totalInstallments: 6,
    amount: 25000,
    targetMonth: currentMonth,
    categoryId: 'ropa_calzado',
    cardName: 'Visa Santander',
    status: 'BILLED',
    space: 'WALLET',
    createdByUid: 'user_nico',
    createdAt: `${prevMonth}-01`
  },
  {
    id: 'inst_zapa_3',
    planId: 'plan_zapatillas',
    description: 'Zapatillas Adidas Running (3/6)',
    installmentNumber: 3,
    totalInstallments: 6,
    amount: 25000,
    targetMonth: nextMonth1,
    categoryId: 'ropa_calzado',
    cardName: 'Visa Santander',
    status: 'PENDING',
    space: 'WALLET',
    createdByUid: 'user_nico',
    createdAt: `${prevMonth}-01`
  },
  {
    id: 'inst_zapa_4',
    planId: 'plan_zapatillas',
    description: 'Zapatillas Adidas Running (4/6)',
    installmentNumber: 4,
    totalInstallments: 6,
    amount: 25000,
    targetMonth: nextMonth2,
    categoryId: 'ropa_calzado',
    cardName: 'Visa Santander',
    status: 'PENDING',
    space: 'WALLET',
    createdByUid: 'user_nico',
    createdAt: `${prevMonth}-01`
  },
  // Heladera No-Frost (Cuota 4/12) en El Hogar
  {
    id: 'inst_hela_cur',
    planId: 'plan_heladera',
    description: 'Heladera Samsung No-Frost (4/12)',
    installmentNumber: 4,
    totalInstallments: 12,
    amount: 48000,
    targetMonth: currentMonth,
    categoryId: 'tecnologia_hogar',
    cardName: 'Mastercard BBVA',
    status: 'BILLED',
    space: 'HOUSEHOLD',
    createdByUid: 'user_nico',
    createdAt: `${prevMonth}-01`
  },
  {
    id: 'inst_hela_next',
    planId: 'plan_heladera',
    description: 'Heladera Samsung No-Frost (5/12)',
    installmentNumber: 5,
    totalInstallments: 12,
    amount: 48000,
    targetMonth: nextMonth1,
    categoryId: 'tecnologia_hogar',
    cardName: 'Mastercard BBVA',
    status: 'PENDING',
    space: 'HOUSEHOLD',
    createdByUid: 'user_nico',
    createdAt: `${prevMonth}-01`
  }
];

// Resumen y transacciones de Dólares (con PPP)
export const INITIAL_DOLLAR_SUMMARY: DollarPortfolioSummary = {
  totalUsdHeld: 1450,
  totalArsInvested: 1827000,
  weightedAveragePrice: 1260, // 1827000 / 1450 = 1260
  lastPurchaseRate: 1285,
  lastUpdated: new Date().toISOString()
};

export const INITIAL_DOLLAR_TRANSACTIONS: DollarTransaction[] = [
  {
    id: 'usd_tx_1',
    type: 'BUY',
    usdAmount: 600,
    exchangeRate: 1240,
    totalArsCost: 744000,
    source: 'MEP',
    notes: 'Aporte mensual sueldo',
    date: `${prevMonth}-15`
  },
  {
    id: 'usd_tx_2',
    type: 'BUY',
    usdAmount: 850,
    exchangeRate: 1274.12,
    totalArsCost: 1083000,
    source: 'BLUE',
    notes: 'Ahorro aguinaldo',
    date: `${currentMonth}-05`
  }
];

// Inversiones Broker (CEDEARs / ETFs)
export const INITIAL_BROKER_TRANSFERS: BrokerTransfer[] = [
  {
    id: 'brk_1',
    broker: 'BALANZ',
    amountArs: 180000,
    targetAsset: 'CEDEARS',
    date: `${currentMonth}-03`,
    periodMonth: currentMonth,
    notes: '50% SPY (S&P 500) y 50% AAPL'
  },
  {
    id: 'brk_2',
    broker: 'IOL',
    amountArs: 120000,
    targetAsset: 'ETFS',
    date: `${currentMonth}-10`,
    periodMonth: currentMonth,
    notes: 'QQQ (Nasdaq 100)'
  }
];

// Presupuestos Mensuales Base
export const INITIAL_BUDGETS: Record<string, MonthlyBudget> = {
  [`WALLET_${currentMonth}`]: {
    periodMonth: currentMonth,
    space: 'WALLET',
    categories: {
      supermercado: { allocated: 120000, spent: 54200, committedCuotas: 0 },
      servicios: { allocated: 40000, spent: 0, committedCuotas: 0 },
      alquiler_expensas: { allocated: 0, spent: 0, committedCuotas: 0 },
      salidas_ocio: { allocated: 90000, spent: 0, committedCuotas: 0 },
      ropa_calzado: { allocated: 60000, spent: 0, committedCuotas: 25000 },
      salud_farmacia: { allocated: 35000, spent: 19500, committedCuotas: 0 },
      transporte_auto: { allocated: 80000, spent: 38000, committedCuotas: 0 },
      educacion: { allocated: 30000, spent: 0, committedCuotas: 0 },
      tecnologia_hogar: { allocated: 40000, spent: 0, committedCuotas: 0 },
      otros: { allocated: 50000, spent: 0, committedCuotas: 0 }
    },
    totalBudgeted: 545000
  },
  [`HOUSEHOLD_${currentMonth}`]: {
    periodMonth: currentMonth,
    space: 'HOUSEHOLD',
    categories: {
      supermercado: { allocated: 260000, spent: 135000, committedCuotas: 0 },
      servicios: { allocated: 110000, spent: 42500, committedCuotas: 0 },
      alquiler_expensas: { allocated: 550000, spent: 88000, committedCuotas: 0 },
      salidas_ocio: { allocated: 60000, spent: 0, committedCuotas: 0 },
      ropa_calzado: { allocated: 0, spent: 0, committedCuotas: 0 },
      salud_farmacia: { allocated: 20000, spent: 0, committedCuotas: 0 },
      transporte_auto: { allocated: 0, spent: 0, committedCuotas: 0 },
      educacion: { allocated: 0, spent: 0, committedCuotas: 0 },
      tecnologia_hogar: { allocated: 100000, spent: 0, committedCuotas: 48000 },
      otros: { allocated: 40000, spent: 0, committedCuotas: 0 }
    },
    totalBudgeted: 1140000
  }
};

// Checklist de Pagos Fijos del Hogar
export const INITIAL_FIXED_EXPENSES: FixedExpense[] = [
  {
    id: 'fix_1',
    name: 'Edenor (Luz Depto)',
    estimatedAmount: 42500,
    actualAmount: 42500,
    dueDate: `${currentMonth}-12`,
    periodMonth: currentMonth,
    isPaid: true,
    paidByUid: 'user_nico',
    paidByName: 'Nico',
    paidAt: `${currentMonth}-10T14:30:00Z`
  },
  {
    id: 'fix_2',
    name: 'Metrogas',
    estimatedAmount: 16800,
    dueDate: `${currentMonth}-19`,
    periodMonth: currentMonth,
    isPaid: false
  },
  {
    id: 'fix_3',
    name: 'Fibertel / Flow Internet 300Mb',
    estimatedAmount: 34200,
    dueDate: `${currentMonth}-23`,
    periodMonth: currentMonth,
    isPaid: false
  },
  {
    id: 'fix_4',
    name: 'Alquiler Depto',
    estimatedAmount: 460000,
    actualAmount: 460000,
    dueDate: `${currentMonth}-05`,
    periodMonth: currentMonth,
    isPaid: true,
    paidByUid: 'user_flor',
    paidByName: 'Flor',
    paidAt: `${currentMonth}-05T10:15:00Z`
  }
];

// Lista de Compras Reactiva
export const INITIAL_SHOPPING_ITEMS: ShoppingItem[] = [
  {
    id: 'shop_1',
    item: '2 kg de bananas y 1 kg manzanas',
    category: 'verduleria',
    isCompleted: false,
    addedByUid: 'user_flor',
    addedByName: 'Flor',
    createdAt: new Date().toISOString()
  },
  {
    id: 'shop_2',
    item: 'Detergente Magistral y Lavandina',
    category: 'supermercado',
    isCompleted: true,
    addedByUid: 'user_nico',
    addedByName: 'Nico',
    completedByUid: 'user_nico',
    completedByName: 'Nico',
    createdAt: new Date().toISOString()
  },
  {
    id: 'shop_3',
    item: 'Café tostado en grano 500g',
    category: 'supermercado',
    isCompleted: false,
    addedByUid: 'user_nico',
    addedByName: 'Nico',
    createdAt: new Date().toISOString()
  },
  {
    id: 'shop_4',
    item: 'Ibuprofeno 400mg',
    category: 'farmacia',
    isCompleted: false,
    addedByUid: 'user_flor',
    addedByName: 'Flor',
    createdAt: new Date().toISOString()
  }
];

// Notificaciones iniciales
export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif_1',
    type: 'PAYMENT_REGISTERED',
    title: 'Pago registrado en El Hogar',
    message: 'Nico marcó como pagado "Edenor ($42.500)".',
    read: false,
    timestamp: 'Hace 2 horas'
  },
  {
    id: 'notif_2',
    type: 'DUE_SOON',
    title: 'Vencimiento próximo',
    message: 'Metrogas ($16.800) vence en 4 días.',
    read: false,
    timestamp: 'Hoy, 09:00'
  },
  {
    id: 'notif_3',
    type: 'BUDGET_EXCEEDED',
    title: 'Alerta de Presupuesto',
    message: 'Has alcanzado el 72% del presupuesto de Supermercado en El Hogar.',
    read: true,
    timestamp: 'Ayer'
  }
];
