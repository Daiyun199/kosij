/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  AwaitedReactNode,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
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
  const [displayedNotifications, setDisplayedNotifications] = useState<
    Set<number>
  >(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const fetchAllNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data.value || response.data);

      const unreadRes = await api.get("/notifications/unread-count");
      setUnreadCount(unreadRes.data.count || unreadRes.data.value?.count);
    } catch (error) {
      console.error("Error fetching all notifications:", error);
    }
  };

  const fetchNewNotifications = async () => {
    try {
      const [unreadRes, newRes] = await Promise.all([
        api.get("/notifications/unread-count"),
        api.get(`/notifications/new/${lastUpdate}`),
      ]);

      setUnreadCount(unreadRes.data.count || unreadRes.data.value?.count);

      if (newRes.data?.value?.length > 0) {
        const newNotifications = newRes.data.value.filter(
          (n: Notification) => !displayedNotifications.has(n.id)
        );

        if (newNotifications.length > 0) {
          newNotifications.forEach(
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
            newNotifications.forEach((n: { id: number }) => newSet.add(n.id));
            return newSet;
          });

          setNotifications((prev) => [...newNotifications, ...prev]);
        }
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
    fetchAllNotifications();
    const interval = setInterval(fetchNewNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

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
