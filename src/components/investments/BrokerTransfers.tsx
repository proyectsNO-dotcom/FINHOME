import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrokerAsset } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Briefcase, Plus, Check, ExternalLink } from 'lucide-react';

export const BrokerTransfers: React.FC = () => {
  const { brokerTransfers, addBrokerTransfer } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [broker, setBroker] = useState<'BALANZ' | 'IOL' | 'COCOS' | 'BULL_MARKET' | 'OTRO'>('BALANZ');
  const [amountStr, setAmountStr] = useState('');
  const [targetAsset, setTargetAsset] = useState<BrokerAsset>('CEDEARS');
  const [notes, setNotes] = useState('');

  const totalTransferred = brokerTransfers.reduce((sum, b) => sum + b.amountArs, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr) || 0;
    if (amount <= 0) return;

    addBrokerTransfer({
      broker,
      amountArs: amount,
      targetAsset,
      notes: notes.trim() || undefined
    });

    setAmountStr('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Resumen de Transferencias a Brokers */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-card flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Capital Aportado en Brokers
          </span>
          <span className="text-2xl font-black text-white block mt-0.5">
            {formatCurrency(totalTransferred)}
          </span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
            <ExternalLink className="w-3 h-3" />
            Rendimiento seguido en plataforma de cada broker
          </span>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white shadow-md active:scale-95 transition"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Lista de Aportes a Brokers */}
      <div className="space-y-2.5">
        {brokerTransfers.map(item => (
          <div 
            key={item.id}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {item.broker}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded">
                    {item.targetAsset}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {item.notes || 'Aporte mensual'} • {item.date}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                {formatCurrency(item.amountArs)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Registrar Aporte al Broker */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                Aporte a Broker (CEDEARs / ETFs)
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Monto Transferido ($ ARS)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="0"
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-2xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Plataforma / Broker
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['BALANZ', 'IOL', 'COCOS', 'BULL_MARKET'] as const).map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBroker(b)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        broker === b
                          ? 'bg-indigo-600 text-white border-transparent'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Instrumento
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['CEDEARS', 'ETFS', 'BONOS_ON'] as BrokerAsset[]).map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setTargetAsset(a)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        targetAsset === a
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalle (ej: Compra de SPY, Apple, QQQ...)"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Registrar Aporte</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
