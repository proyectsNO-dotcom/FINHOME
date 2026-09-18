import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory, PaymentMethod } from '../../types';
import { CATEGORIES_META } from '../../data/initialData';
import { preclassifyDescription } from '../../utils/financialCalculators';
import { formatCurrency, getNextMonth } from '../../utils/formatters';
import { X, Sparkles, CreditCard, Calendar, Check, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_INSTALLMENT_OPTIONS = [1, 3, 6, 9, 12, 18, 24];

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose }) => {
  const { activeSpace, currentMonth, addTransaction } = useApp();
  const isWallet = activeSpace === 'WALLET';

  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [amountStr, setAmountStr] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('supermercado');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('DEBIT');
  
  // Manejo de cuotas
  const [isInstallment, setIsInstallment] = useState<boolean>(false);
  const [installmentCount, setInstallmentCount] = useState<number>(3);
  const [cardName, setCardName] = useState<string>('Visa Santander');

  // Pre-clasificación inteligente
  const [suggestedCategory, setSuggestedCategory] = useState<ExpenseCategory | null>(null);

  useEffect(() => {
    if (description.trim().length > 2) {
      const suggested = preclassifyDescription(description);
      setSuggestedCategory(suggested);
      if (suggested) {
        setCategory(suggested);
      }
    } else {
      setSuggestedCategory(null);
    }
  }, [description]);

  if (!isOpen) return null;

  const numAmount = parseFloat(amountStr) || 0;
  const installmentMonthly = installmentCount > 0 ? Math.round(numAmount / installmentCount) : 0;
  const lastInstallmentMonth = isInstallment && installmentCount > 1 
    ? getNextMonth(currentMonth, installmentCount - 1) 
    : currentMonth;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0 || !description.trim()) return;

    addTransaction({
      type,
      amount: numAmount,
      description: description.trim(),
      categoryId: category,
      paymentMethod,
      isInstallment: type === 'EXPENSE' ? isInstallment : false,
      installmentCount: isInstallment ? installmentCount : 1,
      cardName: isInstallment ? cardName : undefined
    });

    // Micro-animación de éxito
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.85 }
    });

    // Reset y cierre
    setAmountStr('');
    setDescription('');
    setIsInstallment(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isWallet ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Nuevo Registro en {isWallet ? 'Mi Billetera' : 'El Hogar'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Tipo de Operación: Gasto vs Ingreso */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => { setType('EXPENSE'); }}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'EXPENSE'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Gasto / Salida</span>
            </button>
            <button
              type="button"
              onClick={() => { setType('INCOME'); setIsInstallment(false); }}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'INCOME'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Ingreso</span>
            </button>
          </div>

          {/* Gran Input de Monto (Ergonomía Móvil) */}
          <div className="relative">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
              Monto en Pesos ($ ARS)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-2xl font-bold text-slate-400">$</span>
              <input
                type="number"
                inputMode="decimal"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0"
                autoFocus
                required
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-3xl font-extrabold text-slate-900 dark:text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Descripción con Pre-clasificador */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Descripción / Comercio
              </label>
              {suggestedCategory && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full animate-bounce">
                  <Sparkles className="w-3 h-3" />
                  Auto-clasificado
                </span>
              )}
            </div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Coto, Nafta YPF, Edenor, Alquiler..."
              required
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Categoría Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
              Categoría
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(CATEGORIES_META).map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                    category === cat.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Método de Pago */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
              Medio de Pago
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'DEBIT', label: 'Débito' },
                { id: 'CREDIT_CARD', label: 'Tarjeta' },
                { id: 'TRANSFER', label: 'Transf.' },
                { id: 'CASH', label: 'Efectivo' }
              ].map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => {
                    const m = method.id as PaymentMethod;
                    setPaymentMethod(m);
                    if (m === 'CREDIT_CARD') setIsInstallment(true);
                  }}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition ${
                    paymentMethod === method.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECCIÓN CRUCIAL: GESTIÓN DE CUOTAS */}
          {type === 'EXPENSE' && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                    ¿Pagas en cuotas?
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isInstallment} 
                    onChange={(e) => setIsInstallment(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {isInstallment && (
                <div className="space-y-3 pt-2 border-t border-amber-200/60 dark:border-amber-800/40">
                  {/* Selector de cantidad de cuotas */}
                  <div>
                    <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 block mb-1.5">
                      Cantidad de cuotas:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_INSTALLMENT_OPTIONS.map(cnt => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => setInstallmentCount(cnt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            installmentCount === cnt
                              ? 'bg-amber-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {cnt} {cnt === 1 ? 'cuota' : 'cuotas'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nombre de la Tarjeta */}
                  <div>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Tarjeta (ej: Visa Santander, Master Galicia)"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>

                  {/* Simulador y Proyección de Dinero Comprometido */}
                  {numAmount > 0 && installmentCount > 1 && (
                    <div className="p-3 bg-white/80 dark:bg-slate-900/60 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs">
                      <div className="flex items-center justify-between text-amber-900 dark:text-amber-300 font-bold">
                        <span>Monto por mes:</span>
                        <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                          {formatCurrency(installmentMonthly)} / mes
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-amber-700 dark:text-amber-400">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>
                          Compromete presupuesto desde <strong>{currentMonth}</strong> hasta <strong>{lastInstallmentMonth}</strong> ({installmentCount} meses).
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Botón Guardar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={numAmount <= 0 || !description.trim()}
              className={`w-full py-4 rounded-2xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${
                isWallet
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-500/25'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/25'
              }`}
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>
                Confirmar {type === 'EXPENSE' ? 'Gasto' : 'Ingreso'} de {formatCurrency(numAmount)}
              </span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
