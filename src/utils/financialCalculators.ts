import { ExpenseCategory, DollarPortfolioSummary, DollarTransaction, Installment, MonthlyBudget, SpaceType } from '../types';
import { getNextMonth } from './formatters';

// Diccionario de pre-clasificación estricto y contextualizado a Argentina
const KEYWORD_DICTIONARY: Record<string, ExpenseCategory> = {
  // Supermercados y Almacenes
  coto: 'supermercado',
  carrefour: 'supermercado',
  jumbo: 'supermercado',
  disco: 'supermercado',
  vea: 'supermercado',
  dia: 'supermercado',
  changomas: 'supermercado',
  vital: 'supermercado',
  makro: 'supermercado',
  verduleria: 'supermercado',
  carniceria: 'supermercado',
  chino: 'supermercado',
  almacen: 'supermercado',

  // Servicios e Impuestos
  edenor: 'servicios',
  edesur: 'servicios',
  metrogas: 'servicios',
  naturgy: 'servicios',
  aysa: 'servicios',
  telecom: 'servicios',
  fibertel: 'servicios',
  flow: 'servicios',
  personal: 'servicios',
  claro: 'servicios',
  movistar: 'servicios',
  abl: 'servicios',
  arba: 'servicios',
  afip: 'servicios',
  luz: 'servicios',
  gas: 'servicios',
  agua: 'servicios',
  internet: 'servicios',

  // Alquiler y Vivienda
  alquiler: 'alquiler_expensas',
  expensas: 'alquiler_expensas',
  inmobiliaria: 'alquiler_expensas',

  // Salidas, Ocio y Delivery
  pedidosya: 'salidas_ocio',
  rappi: 'salidas_ocio',
  mcdonalds: 'salidas_ocio',
  mostaza: 'salidas_ocio',
  burger: 'salidas_ocio',
  starbucks: 'salidas_ocio',
  cafe: 'salidas_ocio',
  cerveza: 'salidas_ocio',
  bar: 'salidas_ocio',
  cine: 'salidas_ocio',
  teatro: 'salidas_ocio',
  entradas: 'salidas_ocio',
  netflix: 'salidas_ocio',
  spotify: 'salidas_ocio',
  steam: 'salidas_ocio',
  playstation: 'salidas_ocio',
  restaurante: 'salidas_ocio',
  sushi: 'salidas_ocio',
  helado: 'salidas_ocio',

  // Salud y Farmacia
  farmacity: 'salud_farmacia',
  farmacia: 'salud_farmacia',
  osde: 'salud_farmacia',
  swiss: 'salud_farmacia',
  galeno: 'salud_farmacia',
  medico: 'salud_farmacia',
  dentista: 'salud_farmacia',
  remedios: 'salud_farmacia',

  // Transporte y Combustible
  ypf: 'transporte_auto',
  shell: 'transporte_auto',
  axion: 'transporte_auto',
  nafta: 'transporte_auto',
  combustible: 'transporte_auto',
  sube: 'transporte_auto',
  uber: 'transporte_auto',
  cabify: 'transporte_auto',
  didi: 'transporte_auto',
  peaje: 'transporte_auto',
  estacionamiento: 'transporte_auto',
  mecanico: 'transporte_auto',

  // Ropa y Calzado
  zara: 'ropa_calzado',
  nike: 'ropa_calzado',
  adidas: 'ropa_calzado',
  falabella: 'ropa_calzado',
  ropa: 'ropa_calzado',
  zapatillas: 'ropa_calzado',

  // Tecnología y Hogar
  fravega: 'tecnologia_hogar',
  garbarino: 'tecnologia_hogar',
  musimundo: 'tecnologia_hogar',
  cetrogar: 'tecnologia_hogar',
  easy: 'tecnologia_hogar',
  sodimac: 'tecnologia_hogar',
  mercadolibre: 'tecnologia_hogar',
  ferreteria: 'tecnologia_hogar',
};

export const preclassifyDescription = (description: string): ExpenseCategory | null => {
  if (!description) return null;
  const normalized = description.toLowerCase().trim();
  
  // 1. Coincidencia exacta de palabras
  const words = normalized.split(/\s+/);
  for (const word of words) {
    if (KEYWORD_DICTIONARY[word]) {
      return KEYWORD_DICTIONARY[word];
    }
  }

  // 2. Coincidencia de subcadenas clave
  for (const [key, category] of Object.entries(KEYWORD_DICTIONARY)) {
    if (normalized.includes(key)) {
      return category;
    }
  }

  return null;
};

// Cálculo de Precio Promedio Ponderado (PPP) de Dólares
export const calculateUpdatedDollarSummary = (
  current: DollarPortfolioSummary,
  transaction: DollarTransaction
): DollarPortfolioSummary => {
  if (transaction.type === 'BUY') {
    const addedArs = transaction.usdAmount * transaction.exchangeRate;
    const newTotalUsd = current.totalUsdHeld + transaction.usdAmount;
    const newTotalArs = current.totalArsInvested + addedArs;
    const newPPP = newTotalUsd > 0 ? newTotalArs / newTotalUsd : transaction.exchangeRate;

    return {
      totalUsdHeld: newTotalUsd,
      totalArsInvested: newTotalArs,
      weightedAveragePrice: Math.round(newPPP * 100) / 100,
      lastPurchaseRate: transaction.exchangeRate,
      lastUpdated: new Date().toISOString()
    };
  } else {
    // Venta de dólares: reduce el stock de USD y el capital proporcional invertido
    const newTotalUsd = Math.max(0, current.totalUsdHeld - transaction.usdAmount);
    const newTotalArs = Math.max(0, newTotalUsd * current.weightedAveragePrice);
    
    return {
      totalUsdHeld: newTotalUsd,
      totalArsInvested: newTotalArs,
      weightedAveragePrice: current.weightedAveragePrice, // El costo promedio de adquisición no cambia al vender
      lastPurchaseRate: current.lastPurchaseRate,
      lastUpdated: new Date().toISOString()
    };
  }
};

// Generador de proyección de Cuotas en meses futuros ("Dinero Comprometido")
export const generateInstallmentsSchedule = (params: {
  planId: string;
  description: string;
  totalAmount: number;
  totalInstallments: number;
  startPeriodMonth: string;
  categoryId: ExpenseCategory;
  cardName: string;
  space: SpaceType;
  createdByUid: string;
}): Installment[] => {
  const {
    planId,
    description,
    totalAmount,
    totalInstallments,
    startPeriodMonth,
    categoryId,
    cardName,
    space,
    createdByUid
  } = params;

  const installmentAmount = Math.round(totalAmount / totalInstallments);
  const installments: Installment[] = [];

  for (let i = 1; i <= totalInstallments; i++) {
    const targetMonth = getNextMonth(startPeriodMonth, i - 1);
    installments.push({
      id: `${planId}_c${i}_of_${totalInstallments}`,
      planId,
      description: `${description} (${i}/${totalInstallments})`,
      installmentNumber: i,
      totalInstallments,
      amount: installmentAmount,
      targetMonth,
      categoryId,
      cardName,
      status: i === 1 ? 'BILLED' : 'PENDING',
      space,
      createdByUid,
      createdAt: new Date().toISOString()
    });
  }

  return installments;
};

// Semáforo de Presupuesto
export type BudgetStatusLevel = 'safe' | 'warning' | 'danger';

export interface BudgetHealth {
  percentage: number;
  level: BudgetStatusLevel;
  remaining: number;
}

export const calculateBudgetHealth = (spentWithCuotas: number, allocated: number): BudgetHealth => {
  if (!allocated || allocated <= 0) {
    return {
      percentage: spentWithCuotas > 0 ? 100 : 0,
      level: spentWithCuotas > 0 ? 'danger' : 'safe',
      remaining: 0
    };
  }

  const percentage = Math.round((spentWithCuotas / allocated) * 100);
  const remaining = Math.max(0, allocated - spentWithCuotas);

  let level: BudgetStatusLevel = 'safe';
  if (percentage >= 90) {
    level = 'danger'; // 🔴 Rojo
  } else if (percentage >= 70) {
    level = 'warning'; // 🟡 Amarillo
  }

  return {
    percentage,
    level,
    remaining
  };
};

// Clonador de Presupuesto con Ajuste Anti-Inflación
export const cloneBudgetWithInflation = (
  source: MonthlyBudget,
  targetMonth: string,
  inflationPercentage: number
): MonthlyBudget => {
  const multiplier = 1 + (inflationPercentage / 100);
  const newCategories = { ...source.categories };
  let newTotal = 0;

  for (const catKey of Object.keys(newCategories) as ExpenseCategory[]) {
    const currentAllocated = newCategories[catKey]?.allocated || 0;
    // Redondear al millar más cercano (ej: $104.200 -> $104.000)
    const inflatedAllocated = Math.round((currentAllocated * multiplier) / 1000) * 1000;
    
    newCategories[catKey] = {
      allocated: inflatedAllocated,
      spent: 0,
      committedCuotas: 0
    };
    newTotal += inflatedAllocated;
  }

  return {
    periodMonth: targetMonth,
    space: source.space,
    categories: newCategories,
    totalBudgeted: newTotal,
    clonedFromMonth: source.periodMonth,
    inflationMultiplierApplied: multiplier
  };
};
