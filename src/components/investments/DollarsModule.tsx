import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSource } from '../../types';
import { formatCurrency, formatExchangeRate } from '../../utils/formatters';
import { DollarSign, TrendingUp, Plus, ArrowDownRight, ArrowUpRight, Check, History } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DollarsModule: React.FC = () => {
  const { dollarSummary, dollarTransactions, addDollarTransaction } = useApp();

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [operationType, setOperationType] = useState<'BUY' | 'SELL'>('BUY');
  const [usdAmountStr, setUsdAmountStr] = useState('');
  const [exchangeRateStr, setExchangeRateStr] = useState('1280');
  const [source, setSource] = useState<DollarSource>('MEP');
  const [notes, setNotes] = useState('');

  const numUsd = parseFloat(usdAmountStr) || 0;
  const numRate = parseFloat(exchangeRateStr) || 0;
  const totalArs = Math.round(numUsd * numRate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numUsd <= 0 || numRate <= 0) return;

    addDollarTransaction({
      type: operationType,
      usdAmount: numUsd,
      exchangeRate: numRate,
      source,
      notes: notes.trim() || undefined
    });

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.8 }
    });

    setUsdAmountStr('');
    setNotes('');
    setShowBuyModal(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Tarjeta Principal de Cartera Dólares & PPP */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between text-xs font-bold text-emerald-100 mb-1">
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4" />
            Tenencia en Moneda Extranjera
          </span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] tracking-wide">
            USD Ahorro
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-black tracking-tight">
            USD {dollarSummary.totalUsdHeld.toLocaleString('es-AR')}
          </span>
        </div>

        {/* Métrica Estrella: Precio Promedio Ponderado (PPP) */}
        <div className="mt-4 pt-3 border-t border-emerald-400/30 grid grid-cols-2 gap-3">
          <div className="bg-emerald-950/30 p-2.5 rounded-2xl backdrop-blur-sm border border-emerald-400/20">
            <span className="text-[10px] text-emerald-200 block font-semibold">
              Precio Promedio (PPP)
            </span>
            <span className="text-base font-extrabold text-white block mt-0.5">
              {formatExchangeRate(dollarSummary.weightedAveragePrice)}
            </span>
            <span className="text-[9px] text-emerald-300 block">
              Costo unitario histórico
            </span>
          </div>

          <div className="bg-emerald-950/30 p-2.5 rounded-2xl backdrop-blur-sm border border-emerald-400/20">
            <span className="text-[10px] text-emerald-200 block font-semibold">
              Total Invertido
            </span>
            <span className="text-base font-extrabold text-white block mt-0.5">
              {formatCurrency(dollarSummary.totalArsInvested)}
            </span>
            <span className="text-[9px] text-emerald-300 block">
              En pesos ($ ARS)
            </span>
          </div>
        </div>

        {/* Botón de Registro de Compra/Venta */}
        <button
          onClick={() => { setShowBuyModal(true); setOperationType('BUY'); }}
          className="mt-4 w-full py-3 bg-white text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:bg-emerald-50 active:scale-[0.98] transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Registrar Compra de Dólares</span>
        </button>
      </div>

      {/* Historial de Compras / Ventas de Dólares */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <span>Operaciones de Dólares ({dollarTransactions.length})</span>
          </h3>
        </div>

        <div className="space-y-2.5">
          {dollarTransactions.map(tx => (
            <div 
              key={tx.id}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                  tx.type === 'BUY'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                }`}>
                  {tx.type === 'BUY' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {tx.type === 'BUY' ? 'Compra' : 'Venta'} USD {tx.usdAmount}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-bold">
                      {tx.source}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Cotización: {formatExchangeRate(tx.exchangeRate)} • {tx.date}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {formatCurrency(tx.totalArsCost)}
                </span>
                {tx.notes && (
                  <span className="text-[10px] text-slate-400 truncate max-w-[90px] block">
                    {tx.notes}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para Cargar Compra/Venta de Dólares */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                Registrar Operación en Dólares
              </h3>
              <button 
                onClick={() => setShowBuyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selector Compra vs Venta */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOperationType('BUY')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    operationType === 'BUY'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Compra de USD
                </button>
                <button
                  type="button"
                  onClick={() => setOperationType('SELL')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    operationType === 'SELL'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Venta de USD
                </button>
              </div>

              {/* Cantidad USD */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Cantidad de Dólares (USD)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-lg font-bold text-slate-400">USD</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={usdAmountStr}
                    onChange={(e) => setUsdAmountStr(e.target.value)}
                    placeholder="100"
                    required
                    autoFocus
                    className="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Cotización Pagada */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Cotización / Tipo de Cambio ($ ARS por USD)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-lg font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={exchangeRateStr}
                    onChange={(e) => setExchangeRateStr(e.target.value)}
                    placeholder="1280"
                    required
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Fuente del Dólar */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Tipo de Dólar
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['MEP', 'BLUE', 'CRYPTO', 'OFICIAL'] as DollarSource[]).map(src => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setSource(src)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        source === src
                          ? 'bg-emerald-600 text-white border-transparent'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notas opcionales */}
              <div>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas (ej: Ahorro de aguinaldo, banco...)"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Resumen en vivo */}
              {numUsd > 0 && numRate > 0 && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                    Total en Pesos:
                  </span>
                  <span className="font-extrabold text-sm text-emerald-700 dark:text-emerald-300">
                    {formatCurrency(totalArs)}
                  </span>
                </div>
              )}

              {/* Confirmar */}
              <button
                type="submit"
                disabled={numUsd <= 0 || numRate <= 0}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition disabled:opacity-50"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirmar y Actualizar PPP</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
