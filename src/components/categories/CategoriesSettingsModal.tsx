import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryItem } from '../../types';
import { sanitizeText } from '../../utils/security';
import { X, Plus, Tag, ArrowDownLeft, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CategoriesSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_EMOJIS = [
  '🛒', '🍔', '🍕', '☕', '🚗', '⛽', '🏠', '💡', 
  '💊', '🐾', '📚', '💻', '🎮', '✈️', '🎁', '👕', 
  '💼', '💰', '📈', '💳', '🏷️', '🔧', '🎯', '⚡'
];

export const CategoriesSettingsModal: React.FC<CategoriesSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { expenseCategories, incomeCategories, addCustomCategory } = useApp();

  const [activeTab, setActiveTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [newLabel, setNewLabel] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(POPULAR_EMOJIS[0]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentList = activeTab === 'EXPENSE' ? expenseCategories : incomeCategories;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLabel = sanitizeText(newLabel, 40);
    if (!cleanLabel) return;

    addCustomCategory(cleanLabel, activeTab);
    
    // Disparar confetti de éxito
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.8 }
    });

    setNewLabel('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                Configuración de Categorías
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Personaliza tus categorías de gastos e ingresos
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Pestaña: Gastos vs Ingresos */}
        <div className="px-5 pt-3">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('EXPENSE')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'EXPENSE'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Gastos ({expenseCategories.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('INCOME')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'INCOME'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Ingresos ({incomeCategories.length})</span>
            </button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Formulario de Nueva Categoría */}
          <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-indigo-500" />
                Nueva Categoría de {activeTab === 'EXPENSE' ? 'Gasto' : 'Ingreso'}
              </span>
              {isSuccess && (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> ¡Creada con éxito!
                </span>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Nombre de la categoría
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder={activeTab === 'EXPENSE' ? 'Ej: Mascotas, Gimnasio, Cursos...' : 'Ej: Alquiler Cochera, Clases Particulares...'}
                required
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Selector de Emoji */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Elegir Ícono / Emoji
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 max-h-24 overflow-y-auto">
                {POPULAR_EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm transition-transform ${
                      selectedEmoji === emoji 
                        ? 'bg-indigo-100 dark:bg-indigo-900/60 ring-2 ring-indigo-500 scale-110' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!newLabel.trim()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar Categoría</span>
            </button>
          </form>

          {/* Listado de Categorías Existentes */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              Categorías Activas ({currentList.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentList.map(cat => {
                const isCustom = cat.id.startsWith('custom_');
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base flex-shrink-0">
                        {cat.icon || (activeTab === 'EXPENSE' ? '💸' : '💰')}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {cat.label}
                      </span>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                      isCustom
                        ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {isCustom ? 'Personalizada' : 'Sistema'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
