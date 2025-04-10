/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useNotifications } from "@/context/NotificationContext";
import {
  AwaitedReactNode,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
} from "react";
import { toast } from "react-toastify";

export default function NotificationManager() {
  const { notifications, markAsRead } = useNotifications();

  useEffect(() => {
    const newUnreadNotifications = notifications.filter(
      (n: { markAsRead: any; createdTime: string | number | Date }) =>
        !n.markAsRead && new Date(n.createdTime) > new Date(Date.now() - 30000)
    );

    newUnreadNotifications.forEach(
      (notif: {
        id: any;
        message:
          | string
          | number
          | bigint
          | boolean
          | ReactElement<any, string | JSXElementConstructor<any>>
          | Iterable<ReactNode>
          | ReactPortal
          | Promise<AwaitedReactNode>
          | null
          | undefined;
        createdTime: string | number | Date;
      }) => {
        toast.info(
          <div onClick={() => markAsRead(notif.id)}>
            <p className="font-medium">{notif.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(notif.createdTime).toLocaleTimeString()}
            </p>
          </div>,
          {
            toastId: `notification-${notif.id}`,
            autoClose: 5000,
            closeButton: false,
            className: "cursor-pointer",
          }
        );
      }
    );
  }, [notifications]);

  return null;
}
