"use client";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNotifications2 } from "@/context/NotificationContext";

export default function NotificationManager() {
  const { notifications, markAsRead } = useNotifications2();

  useEffect(() => {
    const unreadNotifications = notifications.filter((n) => !n.markAsRead);

    unreadNotifications.forEach((notif) => {
      toast.info(notif.message, {
        toastId: `notification-${notif.id}`,
        autoClose: 5000,
        onClick: () => markAsRead(notif.id),
      });
    });
  }, [notifications]);

  return null;
}
