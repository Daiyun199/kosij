/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle,
  Info,
  ShoppingCart,
  Star,
  Truck,
  XCircle,
  Repeat,
} from "lucide-react";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import api from "@/config/axios.config";
import ProtectedRoute from "@/app/ProtectedRoute";

interface Notification {
  id: number;
  message: string;
  markAsRead: boolean;
  refId: number;
  referenceType:
    | "Order"
    | "Farm"
    | "Trip"
    | "TripRequest"
    | "TripBooking"
    | "WithdrawalRequest"
    | "KoiVariety"
    | "Feedback";
  actionType: string;
  createdTime: string;
}

const getNotificationIcon = (referenceType: string) => {
  switch (referenceType) {
    case "Order":
      return <ShoppingCart className="text-green-600" />;
    case "Trip":
    case "TripRequest":
    case "TripBooking":
      return <Info className="text-purple-600" />;
    case "WithdrawalRequest":
      return <CheckCircle className="text-green-600" />;
    case "Feedback":
      return <Star className="text-yellow-600" />;
    default:
      return <Bell className="text-blue-600" />;
  }
};

const formatTime = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const getActionText = (referenceType: string) => {
  switch (referenceType) {
    case "Order":
      return "View Order Details →";
    case "Trip":
    case "TripRequest":
    case "TripBooking":
      return "Trip Details →";
    case "WithdrawalRequest":
      return "Statement of money →";
    default:
      return null;
  }
};

const Page = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const notificationsPerPage = 10;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        const allNotifications = response.data.value;
        setTotalPages(
          Math.ceil(allNotifications.length / notificationsPerPage)
        );

        const startIndex = (currentPage - 1) * notificationsPerPage;
        const paginatedNotifications = allNotifications.slice(
          startIndex,
          startIndex + notificationsPerPage
        );
        setNotifications(paginatedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentPage]);

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("/notifications/mark-all-as-read");
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, markAsRead: true }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <ManagerLayout title="Notification">
        <div className="bg-gray-50 min-h-screen p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
            <div className="p-8 text-center">Loading notifications...</div>
          </div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div>
        <ManagerLayout title="Notification">
          <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold">Notifications</h2>
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </button>
              </div>
              <ul>
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <li
                      key={notif.id}
                      className={`flex items-start p-4 border-b last:border-none ${
                        !notif.markAsRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="mr-4 text-2xl">
                        {getNotificationIcon(notif.referenceType)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {notif.message}
                          {getActionText(notif.referenceType) && (
                            <a
                              href="#"
                              className="text-blue-600 hover:underline ml-2"
                            >
                              {getActionText(notif.referenceType)}
                            </a>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatTime(notif.createdTime)}
                        </p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-8 text-center">No notifications found</li>
                )}
              </ul>

              {totalPages > 1 && (
                <div className="flex justify-between items-center p-4 border-t">
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * notificationsPerPage + 1}-
                    {Math.min(
                      currentPage * notificationsPerPage,
                      notifications.length
                    )}{" "}
                    of {notifications.length} notifications
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Hiển thị tối đa 5 page number xung quanh current page */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-md flex items-center justify-center ${
                            currentPage === pageNum
                              ? "bg-blue-500 text-white font-medium"
                              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ManagerLayout>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
