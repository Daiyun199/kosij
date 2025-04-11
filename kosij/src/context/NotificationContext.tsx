/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  ReactElement,
  JSXElementConstructor,
  ReactPortal,
  AwaitedReactNode,
} from "react";
import Cookies from "js-cookie";
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
  const [token, setToken] = useState<string | undefined>(() =>
    Cookies.get("token")
  );
  const [loginTime, setLoginTime] = useState(getVietnamTimeISOString());
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [displayedNotifications, setDisplayedNotifications] = useState<
    Set<number>
  >(new Set());
  const [isLoading, setIsLoading] = useState(true);

  function getVietnamTimeISOString() {
    const now = new Date();
    const offsetInMs = 7 * 60 * 60 * 1000;
    const vietnamTime = new Date(now.getTime() + offsetInMs);
    return vietnamTime.toISOString().slice(0, -1);
  }

  useEffect(() => {
    const updateToken = () => {
      const currentToken = Cookies.get("token");
      setToken(currentToken);
    };

    window.addEventListener("tokenChanged", updateToken);
    updateToken();
    return () => window.removeEventListener("tokenChanged", updateToken);
  }, []);

  const fetchAllNotifications = async () => {
    if (!token) return;
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data.value || response.data);

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
      const newNotifications = newRes.data?.value || [];

      const filteredNewNotifications = newNotifications.filter(
        (n: Notification) =>
          !displayedNotifications.has(n.id) &&
          new Date(n.createdTime).getTime() > new Date(loginTime).getTime()
      );

      if (filteredNewNotifications.length > 0) {
        filteredNewNotifications.forEach(
          (notif: {
            message:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<AwaitedReactNode>
              | ((props: ToastContentProps<unknown>) => ReactNode)
              | null
              | undefined;
            id: number;
          }) => {
            toast.info(notif.message, {
              toastId: `notification-${notif.id}`,
              autoClose: 5000,
              onClick: () => markAsRead(notif.id),
            });
          }
        );

        setDisplayedNotifications((prev) => {
          const newSet = new Set(prev);
          filteredNewNotifications.forEach((n: { id: number }) =>
            newSet.add(n.id)
          );
          return newSet;
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
    setDisplayedNotifications(new Set());

    const initFetch = async () => {
      await fetchAllNotifications();
    };

    initFetch();

    const interval = setInterval(fetchNewNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

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

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
}
