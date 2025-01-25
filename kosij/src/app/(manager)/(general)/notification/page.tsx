import React from "react";
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

const notifications = [
  {
    icon: <Bell className="text-blue-600" />,
    title: "Welcome to the Koi Ordering System in Japan (KOSIJ)!",
    time: "Just now",
    link: null,
    type: "info",
  },
  {
    icon: <Info className="text-purple-600" />,
    title:
      "Your farm will soon welcome visitors from the 2 Days 1 Night Koi Asakura Trip",
    time: "2 hours ago",
    link: "Trip Details →",
    type: "info",
  },
  {
    icon: <ShoppingCart className="text-green-600" />,
    title: "You have just received a new order from a customer",
    time: "5 hours ago",
    link: "View Order Details →",
    type: "info",
  },
  {
    icon: <Truck className="text-green-600" />,
    title: "Order #ORD-12349 has been successfully delivered by Delivery Staff",
    time: "1 day ago",
    link: null,
    type: "success",
  },
  {
    icon: <CheckCircle className="text-green-600" />,
    title: "You have just received 5,000,000 VND from order #ORD-12349",
    time: "1 day ago",
    link: "View amount details →",
    type: "success",
  },
  {
    icon: <Star className="text-yellow-600" />,
    title: "Customer Junnie has submitted a review about your farm + product",
    time: "2 days ago",
    link: null,
    type: "info",
  },
  {
    icon: <XCircle className="text-red-600" />,
    title: "Special: Order #ORD-12350 has 1 Koi confirmed dead.",
    time: "2 days ago",
    link: null,
    type: "error",
  },
  {
    icon: <Repeat className="text-red-600" />,
    title:
      "Special: Order #ORD-12350 was not received by Customer Junnie and will be returned to the Farm.",
    time: "2 days ago",
    link: "Statement of money →",
    type: "error",
  },
];

const Page = () => {
  return (
    <div>
      <ManagerLayout title="Notification">
        <div className="bg-gray-50 min-h-screen p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <button className="text-sm text-blue-600 hover:underline">
                Mark all as read
              </button>
            </div>
            <ul>
              {notifications.map((notif, index) => (
                <li
                  key={index}
                  className={`flex items-start p-4 border-b last:border-none ${
                    notif.type === "error" ? "bg-red-50" : ""
                  }`}
                >
                  <div className="mr-4 text-2xl">{notif.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {notif.title}
                      {notif.link && (
                        <a
                          href="#"
                          className="text-blue-600 hover:underline ml-2"
                        >
                          {notif.link}
                        </a>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ManagerLayout>
    </div>
  );
};

export default Page;
