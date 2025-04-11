/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/config/axios.config";

interface Notification {
  id: number;
  message: string;
  markAsRead: boolean;
  refId: number;
  referenceType: string;
  createdTime: string;
}

interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastUpdate, setLastUpdate] = useState(() =>
    new Date(Date.now() - 30000).toISOString()
  );
  const fetchAllNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data.value);

      // Cập nhật unread count
      const unreadRes = await api.get("/notifications/unread-count");
      setUnreadCount(unreadRes.data.count);
    } catch (error) {
      console.error("Error fetching all notifications:", error);
    }
  };

  const fetchData = async () => {
    try {
      const [unreadRes, newRes] = await Promise.all([
        api.get("/notifications/unread-count"),
        api.get(`/notifications/new/${lastUpdate}`),
      ]);

      setUnreadCount(unreadRes.data.value.count);

      if (newRes.data.value.length > 0) {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const newNotifications = newRes.data.value.filter(
            (n: Notification) => !existingIds.has(n.id)
          );
          return [...newNotifications, ...prev];
        });
      }
    } catch (error) {
      console.error("Notification fetch error:", error);
    } finally {
      setLastUpdate(new Date().toISOString());
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notification/${id}/mark-as-read`, { markAsRead: true });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, markAsRead: true } : n))
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        refreshNotifications: fetchData,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
}
