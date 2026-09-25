// Tipos principales del sistema FINHOME

export type SpaceType = 'WALLET' | 'HOUSEHOLD';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  activeHouseholdId: string | null;
  createdAt?: string;
}

export type PaymentMethod = 'CASH' | 'DEBIT' | 'CREDIT_CARD' | 'TRANSFER';

export interface CategoryItem {
  id: string;
  label: string;
  type: 'EXPENSE' | 'INCOME';
  iconName?: string;
  icon?: string;
  color?: string;
  isCustom?: boolean;
}

export type ExpenseCategory = string;
export type IncomeCategory = string;

export interface Transaction {
  id: string;
  type: 'EXPENSE' | 'INCOME';
  amount: number;
  description: string;
  categoryId: string;
  paymentMethod: PaymentMethod;
  space: SpaceType;
  isInstallment: boolean;
  installmentDetails?: {
    totalInstallments: number;
    installmentAmount: number;
    planId: string;
  };
  date: string;         // ISO string o YYYY-MM-DD
  periodMonth: string;  // "YYYY-MM" (ej: "2026-10")
  createdByUid: string;
  createdByName: string;
}

export interface Installment {
  id: string;
  planId: string;
  description: string;
  installmentNumber: number;
  totalInstallments: number;
  amount: number;
  targetMonth: string; // "YYYY-MM"
  categoryId: ExpenseCategory;
  cardName: string;
  status: 'PENDING' | 'BILLED' | 'PAID';
  space: SpaceType;
  createdByUid: string;
  createdAt: string;
}

// Inversiones & Dólares
export type DollarSource = 'MEP' | 'BLUE' | 'OFICIAL' | 'CRYPTO';

export interface DollarTransaction {
  id: string;
  type: 'BUY' | 'SELL';
  usdAmount: number;
  exchangeRate: number; // Cotización al momento de la compra
  totalArsCost: number; // usdAmount * exchangeRate
  source: DollarSource;
  notes?: string;
  date: string;
}

export interface DollarPortfolioSummary {
  totalUsdHeld: number;
  totalArsInvested: number;
  weightedAveragePrice: number; // PPP = totalArsInvested / totalUsdHeld
  lastPurchaseRate: number;
  lastUpdated: string;
}

export type BrokerAsset = 'CEDEARS' | 'ETFS' | 'ACCIONES' | 'BONOS_ON';

export interface BrokerTransfer {
  id: string;
  broker: 'IOL' | 'BALANZ' | 'COCOS' | 'BULL_MARKET' | 'OTRO';
  amountArs: number;
  targetAsset: BrokerAsset;
  date: string;
  periodMonth: string;
  notes?: string;
}

// Presupuestos con prevención de inflación
export interface CategoryBudget {
  allocated: number;
  spent: number;
  committedCuotas: number;
}

export interface MonthlyBudget {
  periodMonth: string; // "YYYY-MM"
  space: SpaceType;
  categories: Record<ExpenseCategory, CategoryBudget>;
  totalBudgeted: number;
  clonedFromMonth?: string;
  inflationMultiplierApplied?: number;
}

// Gestión Colaborativa del Hogar
export interface Household {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  createdAt: string;
}

export interface HouseholdMember {
  uid: string;
  displayName: string;
  email: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface FixedExpense {
  id: string;
  name: string; // Ej: "Edenor (Luz)", "Metrogas", "Expensas"
  estimatedAmount: number;
  actualAmount?: number;
  dueDate: string; // "YYYY-MM-DD"
  periodMonth: string; // "YYYY-MM"
  isPaid: boolean;
  paidByUid?: string;
  paidByName?: string;
  paidAt?: string;
}

export interface ShoppingItem {
  id: string;
  item: string;
  category: 'supermercado' | 'verduleria' | 'farmacia' | 'otros';
  isCompleted: boolean;
  addedByUid: string;
  addedByName: string;
  completedByUid?: string;
  completedByName?: string;
  createdAt: string;
}

// Notificaciones In-App
export type NotificationType = 'BUDGET_EXCEEDED' | 'DUE_SOON' | 'PAYMENT_REGISTERED' | 'TASK_COMPLETED';

export interface InAppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}
