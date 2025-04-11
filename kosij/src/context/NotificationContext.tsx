/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  ReactElement,
  JSXElementConstructor,
  ReactPortal,
  AwaitedReactNode,
} from "react";
import api from "@/config/axios.config";
import { toast, ToastContentProps } from "react-toastify";

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
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | undefined>(
    () => sessionStorage.getItem("token") || undefined
  );
  const notificationIdsRef = useRef<Set<number>>(new Set());
  const [loginTime, setLoginTime] = useState(getVietnamTimeISOString());
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function getVietnamTimeISOString() {
    const now = new Date();
    const offsetInMs = 7 * 60 * 60 * 1000;
    const vietnamTime = new Date(now.getTime() + offsetInMs);
    return vietnamTime.toISOString().slice(0, -1);
  }

  useEffect(() => {
    const updateToken = () => {
      const currentToken = sessionStorage.getItem("token");
      setToken(currentToken ?? undefined);
    };

    window.addEventListener("tokenChanged", updateToken);
    updateToken();
    return () => window.removeEventListener("tokenChanged", updateToken);
  }, []);

  const fetchAllNotifications = async () => {
    if (!token) return;
    try {
      const response = await api.get("/notifications");
      const fetched = response.data.value || response.data;

      // Cập nhật ref tránh lặp
      fetched.forEach((n: Notification) =>
        notificationIdsRef.current.add(n.id)
      );

      setNotifications(fetched);

      const unreadRes = await api.get("/notifications/unread-count");
      setUnreadCount(unreadRes.data.count || unreadRes.data.value?.count);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching all notifications:", error);
    }
  };

  const fetchNewNotifications = async () => {
    if (!token || !loginTime) return;

    try {
      const [unreadRes, newRes] = await Promise.all([
        api.get("/notifications/unread-count"),
        api.get(`/notifications/new/${loginTime}`),
      ]);

      setUnreadCount(unreadRes.data.count || unreadRes.data.value?.count);

      const newNotifications: Notification[] = newRes.data?.value || [];

      const filteredNewNotifications = newNotifications.filter(
        (n) =>
          !notificationIdsRef.current.has(n.id) &&
          new Date(n.createdTime).getTime() > new Date(loginTime).getTime()
      );

      if (filteredNewNotifications.length > 0) {
        filteredNewNotifications.forEach((notif) => {
          notificationIdsRef.current.add(notif.id); // Quan trọng: tránh lặp

          toast.info(notif.message, {
            autoClose: 5000,
            onClick: () => markAsRead(notif.id),
          });
        });

        setNotifications((prev) => [...filteredNewNotifications, ...prev]);
      }
    } catch (error) {
      console.error("Notification fetch error:", error);
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
    if (!token) return;

    const now = getVietnamTimeISOString();
    setLoginTime(now);
    setNotifications([]);
    setUnreadCount(0);
    notificationIdsRef.current.clear();

    const delayFetch = setTimeout(() => {
      fetchAllNotifications();
    }, 1000);

    const interval = setInterval(fetchNewNotifications, 30000);

    return () => {
      clearTimeout(delayFetch);
      clearInterval(interval);
    };
  }, [token]);

  if (!token) {
    return <>{children}</>;
  }

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        refreshNotifications: fetchAllNotifications,
        markAsRead,
        isLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications2() {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      unreadCount: 0,
      notifications: [],
      refreshNotifications: async () => {},
      markAsRead: async () => {},
      isLoading: true,
    };
  }
  return context;
}
