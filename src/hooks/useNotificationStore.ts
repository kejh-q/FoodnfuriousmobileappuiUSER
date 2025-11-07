import { useState, useEffect } from "react";

export interface StoredNotification {
  id: string;
  type: "order" | "promotion" | "system" | "delivery";
  title: string;
  message: string;
  time: string;
  timestamp: number;
  isRead: boolean;
  image?: string;
}

const NOTIFICATIONS_KEY = "um_eats_notifications_";

export function useNotificationStore(userId?: string) {
  const [storedNotifications, setStoredNotifications] = useState<StoredNotification[]>([]);

  // Load notifications from localStorage when userId changes
  useEffect(() => {
    if (userId) {
      const savedNotifications = localStorage.getItem(NOTIFICATIONS_KEY + userId);
      if (savedNotifications) {
        try {
          setStoredNotifications(JSON.parse(savedNotifications));
        } catch (error) {
          console.error("Error loading notifications:", error);
          setStoredNotifications([]);
        }
      } else {
        // New user - start with welcome notification
        const welcomeNotification: StoredNotification = {
          id: `welcome-${Date.now()}`,
          type: "system",
          title: "Welcome to Food n Furious! 🎉",
          message: "Start ordering from your favorite UM cafés. Explore the menu and enjoy fast delivery!",
          time: "Just now",
          timestamp: Date.now(),
          isRead: false,
        };
        setStoredNotifications([welcomeNotification]);
      }
    } else {
      // No user logged in - clear notifications
      setStoredNotifications([]);
    }
  }, [userId]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (userId && storedNotifications.length > 0) {
      localStorage.setItem(NOTIFICATIONS_KEY + userId, JSON.stringify(storedNotifications));
    }
  }, [storedNotifications, userId]);

  const addNotification = (notification: Omit<StoredNotification, "id" | "timestamp">) => {
    const newNotification: StoredNotification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    
    setStoredNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setStoredNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setStoredNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const clearAll = () => {
    setStoredNotifications([]);
    if (userId) {
      localStorage.removeItem(NOTIFICATIONS_KEY + userId);
    }
  };

  const getUnreadCount = () => {
    return storedNotifications.filter((n) => !n.isRead).length;
  };

  return {
    storedNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount: getUnreadCount(),
  };
}
