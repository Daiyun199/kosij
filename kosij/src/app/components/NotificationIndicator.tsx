"use client";
import { Bell } from "lucide-react";
import { useNotifications2 } from "@/context/NotificationContext";

export default function NotificationIndicator() {
  const { unreadCount } = useNotifications2();

  if (unreadCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <Bell className="text-blue-600 w-8 h-8" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      </div>
    </div>
  );
}
