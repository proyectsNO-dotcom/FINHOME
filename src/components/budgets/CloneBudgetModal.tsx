import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getNextMonth, formatMonth, formatCurrency } from '../../utils/formatters';
import { Copy, TrendingUp, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CloneBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloneBudgetModal: React.FC<CloneBudgetModalProps> = ({ isOpen, onClose }) => {
  const { currentBudget, currentMonth, cloneCurrentBudget } = useApp();
  
  const targetDefaultMonth = getNextMonth(currentMonth, 1);
  const [targetMonth, setTargetMonth] = useState(targetDefaultMonth);
  const [inflationPct, setInflationPct] = useState<number>(4.5);

  if (!isOpen || !currentBudget) return null;

  const currentTotal = currentBudget.totalBudgeted;
  const projectedTotal = Math.round((currentTotal * (1 + inflationPct / 100)) / 1000) * 1000;

  const handleClone = () => {
    cloneCurrentBudget(inflationPct, targetMonth);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-300">
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
              <Copy className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Clonar Presupuesto
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Copia todas tus categorías de <strong>{formatMonth(currentMonth)}</strong> aplicando un incremento porcentual por inflación para no cargar todo de cero.
        </p>

        {/* Mes Destino */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Mes de Destino
            </label>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white flex items-center justify-between">
              <span>{formatMonth(targetMonth)}</span>
              <span className="text-xs text-indigo-600 font-semibold">Siguiente mes</span>
            </div>
          </div>

          {/* Ajuste por Inflación */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                Ajuste por Inflación Estimada
              </label>
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                +{inflationPct}%
              </span>
            </div>

            {/* Quick Badges */}
            <div className="flex gap-2 mb-2">
              {[3, 4.5, 6, 8].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setInflationPct(pct)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                    inflationPct === pct
                      ? 'bg-amber-500 text-white border-transparent'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  +{pct}%
                </button>
              ))}
            </div>

            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={inflationPct}
              onChange={(e) => setInflationPct(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Resumen Comparativo */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Presupuesto actual:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{formatCurrency(currentTotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold pt-1 border-t border-slate-200 dark:border-slate-700">
              <span>Nuevo total estimado:</span>
              <span className="text-sm font-extrabold">{formatCurrency(projectedTotal)}</span>
            </div>
          </div>

          {/* Botón Acción */}
          <button
            onClick={handleClone}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition active:scale-[0.98]"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Confirmar y Crear Presupuesto</span>
          </button>

        </div>
      </div>
    </div>
  );
};
