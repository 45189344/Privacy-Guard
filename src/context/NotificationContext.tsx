import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationItem } from '@/types';
import { StorageService } from '@/services/storage';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  showToast: (title: string, message: string, type?: NotificationItem['type']) => void;
  activeToast: { title: string; message: string; type: NotificationItem['type'] } | null;
  dismissToast: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeToast, setActiveToast] = useState<{
    title: string;
    message: string;
    type: NotificationItem['type'];
  } | null>(null);

  const refreshNotifications = useCallback(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const all = StorageService.getNotifications();
    const userNotifs = all.filter((n) => n.userId === user.id || user.role === 'dpo_admin');
    setNotifications(userNotifs);
  }, [user]);

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 2000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const markAsRead = (id: string) => {
    StorageService.markNotificationRead(id);
    refreshNotifications();
  };

  const markAllAsRead = () => {
    if (user) {
      StorageService.markAllNotificationsRead(user.id);
      refreshNotifications();
    }
  };

  const showToast = (title: string, message: string, type: NotificationItem['type'] = 'INFO') => {
    setActiveToast({ title, message, type });
    setTimeout(() => {
      setActiveToast((curr) => (curr?.title === title ? null : curr));
    }, 4500);
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        showToast,
        activeToast,
        dismissToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
