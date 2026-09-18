// Formateadores de moneda y fecha adaptados al contexto argentino

export const formatCurrency = (amount: number, currency: 'ARS' | 'USD' = 'ARS'): string => {
  if (isNaN(amount)) return currency === 'ARS' ? '$ 0' : 'USD 0';
  
  if (currency === 'USD') {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(amount).replace('US$', 'USD ');
  }

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatExchangeRate = (rate: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rate);
};

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const formatMonth = (periodMonth: string): string => {
  // periodMonth: "YYYY-MM"
  if (!periodMonth || !periodMonth.includes('-')) return periodMonth;
  const [year, monthStr] = periodMonth.split('-');
  const monthIdx = parseInt(monthStr, 10) - 1;
  return `${MONTH_NAMES[monthIdx] || ''} ${year}`;
};

export const getNextMonth = (periodMonth: string, offset = 1): string => {
  const [yearStr, monthStr] = periodMonth.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10) + offset;
  
  while (month > 12) {
    month -= 12;
    year += 1;
  }
  while (month < 1) {
    month += 12;
    year -= 1;
  }
  
  return `${year}-${String(month).padStart(2, '0')}`;
};

export const getPreviousMonth = (periodMonth: string): string => {
  return getNextMonth(periodMonth, -1);
};

export const getCurrentPeriodMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};
