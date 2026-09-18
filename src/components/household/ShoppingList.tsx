import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Plus, CheckCircle2, Circle, Apple, Store, Pill, MoreHorizontal } from 'lucide-react';
import confetti from 'canvas-confetti';

type ShoppingCategory = 'supermercado' | 'verduleria' | 'farmacia' | 'otros';

export const ShoppingList: React.FC = () => {
  const { shoppingList, toggleShoppingItem, addShoppingItem } = useApp();

  const [newItemText, setNewItemText] = useState('');
  const [category, setCategory] = useState<ShoppingCategory>('supermercado');

  const pendingItems = shoppingList.filter(s => !s.isCompleted);
  const completedItems = shoppingList.filter(s => s.isCompleted);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    addShoppingItem(newItemText.trim(), category);
    setNewItemText('');
  };

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    toggleShoppingItem(id);
    if (!currentlyCompleted) {
      confetti({
        particleCount: 15,
        spread: 30,
        origin: { y: 0.85 }
      });
    }
  };

  const getCategoryIcon = (cat: ShoppingCategory) => {
    switch (cat) {
      case 'verduleria': return <Apple className="w-3.5 h-3.5 text-emerald-500" />;
      case 'farmacia': return <Pill className="w-3.5 h-3.5 text-rose-500" />;
      case 'otros': return <MoreHorizontal className="w-3.5 h-3.5 text-slate-500" />;
      default: return <Store className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Barra Rápida de Agregado */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-card">
        <form onSubmit={handleAdd} className="space-y-2.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="¿Qué falta en casa? (Ej: Yerba, Tomates...)"
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!newItemText.trim()}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl disabled:opacity-40 transition active:scale-95 shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Categoría Selector Rápido */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'supermercado', label: 'Supermercado' },
              { id: 'verduleria', label: 'Verdulería' },
              { id: 'farmacia', label: 'Farmacia' },
              { id: 'otros', label: 'Otros' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id as ShoppingCategory)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap border transition ${
                  category === cat.id
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Lista de Faltantes Pendientes */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <span>Por Comprar ({pendingItems.length})</span>
          </h3>
        </div>

        {pendingItems.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">
            ¡No hay faltantes anotados en este momento!
          </p>
        ) : (
          <div className="space-y-2">
            {pendingItems.map(item => (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id, item.isCompleted)}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between cursor-pointer hover:border-emerald-300 transition select-none"
              >
                <div className="flex items-center gap-3">
                  <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500 transition" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {item.item}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      {getCategoryIcon(item.category)}
                      Anotado por {item.addedByName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista de Comprados / Tachados */}
      {completedItems.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-card space-y-3">
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
            Ya Comprados ({completedItems.length})
          </h3>

          <div className="space-y-2">
            {completedItems.map(item => (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id, item.isCompleted)}
                className="p-2.5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between cursor-pointer opacity-70 hover:opacity-100 transition select-none"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  <span className="text-xs font-medium line-through text-slate-500 dark:text-slate-400">
                    {item.item}
                  </span>
                </div>
                {item.completedByName && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    por {item.completedByName}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
