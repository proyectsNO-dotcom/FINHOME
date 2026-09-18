import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatMonth, getNextMonth, getPreviousMonth } from '../../utils/formatters';
import { Wallet, Home, Bell, ChevronLeft, ChevronRight, WifiOff } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const { 
    activeSpace, 
    setActiveSpace, 
    currentMonth, 
    setCurrentMonth, 
    unreadCount, 
    isOnline 
  } = useApp();

  const isWallet = activeSpace === 'WALLET';

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-md mx-auto px-4 pt-3 pb-3">
        {/* Top Row: Switcher Dual & Campana de Notificaciones */}
        <div className="flex items-center justify-between gap-3">
          {/* Dual Pill Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner flex-1 max-w-[260px]">
            <button
              onClick={() => setActiveSpace('WALLET')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                isWallet
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Mi Billetera</span>
            </button>

            <button
              onClick={() => setActiveSpace('HOUSEHOLD')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                !isWallet
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>El Hogar</span>
            </button>
          </div>

          {/* Right Actions: Offline Alert & Notifications */}
          <div className="flex items-center gap-2">
            {!isOnline && (
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-semibold border border-amber-300">
                <WifiOff className="w-3 h-3" />
                <span className="hidden sm:inline">Offline</span>
              </div>
            )}

            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-95"
              aria-label="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Row: Selector de Período Mensual */}
        <div className="flex items-center justify-between mt-2.5 px-1">
          <button
            onClick={() => setCurrentMonth(getPreviousMonth(currentMonth))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 active:scale-90 transition"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {formatMonth(currentMonth)}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              isWallet 
                ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400' 
                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
            }`}>
              {isWallet ? 'Privado' : 'Compartido'}
            </span>
          </div>

          <button
            onClick={() => setCurrentMonth(getNextMonth(currentMonth))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 active:scale-90 transition"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
