import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { CheckCircle2, Circle, Plus, Calendar, AlertCircle, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FixedExpenses: React.FC = () => {
  const { fixedExpenses, toggleFixedExpense, addFixedExpense } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [dueDate, setDueDate] = useState('');

  const totalMonthly = fixedExpenses.reduce((sum, item) => sum + (item.actualAmount || item.estimatedAmount), 0);
  const totalPaid = fixedExpenses.filter(i => i.isPaid).reduce((sum, item) => sum + (item.actualAmount || item.estimatedAmount), 0);
  const pendingCount = fixedExpenses.filter(i => !i.isPaid).length;

  const handleToggle = (id: string, currentlyPaid: boolean) => {
    toggleFixedExpense(id);
    if (!currentlyPaid) {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.8 }
      });
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr) || 0;
    if (!name.trim() || amount <= 0) return;

    addFixedExpense({
      name: name.trim(),
      estimatedAmount: amount,
      dueDate: dueDate || new Date().toISOString().split('T')[0]
    });

    setName('');
    setAmountStr('');
    setDueDate('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Resumen de Servicios del Hogar */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white shadow-lg shadow-teal-600/20">
        <div className="flex items-center justify-between text-xs text-teal-100 font-bold mb-1">
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            Checklist de Servicios & Alquiler
          </span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">
            {pendingCount === 0 ? 'Todo Pagado 🎉' : `${pendingCount} pendientes`}
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-2">
          <div>
            <span className="text-2xl font-black">
              {formatCurrency(totalPaid)}
            </span>
            <span className="text-xs text-teal-200 block">
              pagado de {formatCurrency(totalMonthly)} total
            </span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="p-2.5 bg-white text-teal-800 rounded-2xl text-xs font-bold flex items-center gap-1 shadow hover:bg-teal-50 active:scale-95 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nuevo</span>
          </button>
        </div>
      </div>

      {/* Lista de Pagos Fijos */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-card space-y-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
          Servicios del Mes ({fixedExpenses.length})
        </h3>

        <div className="space-y-2.5">
          {fixedExpenses.map(item => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id, item.isPaid)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                item.isPaid
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 opacity-85'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                    item.isPaid ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'
                  }`}
                >
                  {item.isPaid ? (
                    <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 stroke-[2]" />
                  )}
                </button>

                <div>
                  <h4 className={`text-xs font-bold ${
                    item.isPaid ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                  }`}>
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Vence: {item.dueDate}
                    </span>
                    {item.isPaid && item.paidByName && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        • Pagado por {item.paidByName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-extrabold block ${
                  item.isPaid ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {formatCurrency(item.actualAmount || item.estimatedAmount)}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full inline-block ${
                  item.isPaid 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {item.isPaid ? 'Pagado' : 'Pendiente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Agregar Servicio */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                Agregar Pago Fijo del Hogar
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 text-xs font-bold"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Nombre del Servicio o Impuesto
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Metrogas, ABL, Seguro Hogar..."
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Monto Estimado ($ ARS)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="0"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Fecha de Vencimiento
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-teal-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 transition"
              >
                <span>Guardar Servicio</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
