"use client";
import { Bell } from "lucide-react";
import { useNotifications2 } from "@/context/NotificationContext";
import { useEffect, useState } from "react";
import { decodeJwt } from "@/lib/domain/User/decodeJwt.util";

export default function NotificationIndicator() {
  const { unreadCount } = useNotifications2();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = decodeJwt(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  // Chỉ hiển thị nếu có thông báo và role hợp lệ
  if (unreadCount === 0 || !(role === "salesstaff" || role === "manager"))
    return null;

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
