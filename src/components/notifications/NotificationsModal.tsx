import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, CheckCheck, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';
import { NotificationType } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAllNotificationsAsRead } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'BUDGET_EXCEEDED':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'DUE_SOON':
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case 'PAYMENT_REGISTERED':
      case 'TASK_COMPLETED':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Centro de Notificaciones
              </h3>
              <span className="text-[10px] text-slate-400">
                {unreadCount > 0 ? `${unreadCount} nuevas sin leer` : 'Al día'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 p-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Leídas</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              No tienes notificaciones por ahora.
            </p>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  notif.read
                    ? 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-75'
                    : 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-900/60 shadow-sm ring-1 ring-indigo-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex-shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
