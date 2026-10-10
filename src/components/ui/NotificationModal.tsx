import React from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { X, CheckCheck, Bell, AlertTriangle, CheckCircle, Info, AlertOctagon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'ERROR':
        return <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'ACTION_REQUIRED':
        return <AlertTriangle className="w-4 h-4 text-sky-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-teal-500 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 sm:pt-20 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-midnight-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/60 dark:bg-midnight-950/60">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-500" />
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Notifications ({notifications.filter((n) => !n.read).length} unread)
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={markAllAsRead}
              title="Mark all as read"
              className="p-1 rounded text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-xs flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-2 divide-y divide-slate-100 dark:divide-white/5 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No notifications at this time
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-3 rounded-xl transition-colors cursor-pointer ${
                  item.read
                    ? 'opacity-70 hover:bg-slate-50 dark:hover:bg-midnight-800/40'
                    : 'bg-teal-500/5 dark:bg-teal-400/5 hover:bg-teal-500/10'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{getIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {item.requestId && (
                        <Link
                          to={`/app/requests/${item.requestId}`}
                          onClick={onClose}
                          className="text-teal-600 dark:text-teal-400 hover:underline font-mono"
                        >
                          View {item.requestId}
                        </Link>
                      )}
                    </div>
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
