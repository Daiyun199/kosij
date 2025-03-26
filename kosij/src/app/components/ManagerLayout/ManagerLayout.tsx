"use client";
import React from "react";
import CustomLayout from "@/app/components/Layout/Layout";

interface ManagerLayoutProps {
  title: string;
  children: React.ReactNode;
}

const ManagerLayout: React.FC<ManagerLayoutProps> = ({ title, children }) => {
  const menuItems = [
    {
      label: "General",
      icon: "fa-solid fa-house",
      children: [
        {
          label: "Dashboard",
          icon: "fa-solid fa-chart-pie",
          path: "/manager/dashboard",
          children: [
            {
              label: "Finance",
              icon: "fa-solid fa-money-bill-wave",
              path: "/manager/dashboard/finance",
            },
            {
              label: "Order",
              icon: "fa-solid fa-box",
              path: "/manager/dashboard/orders",
            },
            {
              label: "Tour",
              icon: "fa-solid fa-umbrella-beach",
              path: "/manager/dashboard/tour",
            },
          ],
        },
        {
          label: "Notifications",
          icon: "fa-solid fa-bell",
          path: "/manager/notification",
        },
        {
          label: "Profile",
          icon: "fa-solid fa-user",
          path: "/manager/profile",
        },
      ],
    },
    {
      label: "Management",
      icon: "fa-solid fa-cogs",
      children: [
        {
          label: "Account",
          icon: "fa-solid fa-user",
          children: [
            {
              label: "Customer",
              icon: "fa-solid fa-users",
              path: "/manager/customers",
            },
            {
              label: "Sale Staff",
              icon: "fa-solid fa-headphones",
              path: "/manager/sales",
            },
            {
              label: "Delivery Staff",
              icon: "fa-solid fa-truck-fast",
              path: "/manager/deliveries",
            },
            {
              label: "Fram Breeder",
              icon: "fa-solid fa-fish-fins",
              path: "/manager/farms",
            },
            {
              label: "Consultant Staff",
              icon: "fa-solid fa-user-tie",
              path: "/manager/consultants",
            },
            {
              label: "Register",
              icon: "fa-solid fa-user-plus",
              path: "/manager/account-create",
            },
          ],
        },
        {
          label: "Order",
          icon: "fa-solid fa-shopping-cart",
          path: "/manager/orders",
        },
        {
          label: "Request",
          icon: "fa-solid fa-paper-plane",
          children: [
            {
              label: "All",
              icon: "fa-solid fa-list",
              path: "/manager/requests/all",
            },
            {
              label: "Processing",
              icon: "fa-solid fa-spinner",
              path: "/manager/requests/processing",
            },
            {
              label: "Pending",
              icon: "fa-solid fa-hourglass-half",
              path: "/manager/requests/pending",
            },
          ],
        },
        {
          label: "Tour",
          icon: "fa-solid fa-map",
          children: [
            {
              label: "List",
              icon: "fa-solid fa-list",
              path: "/manager/tours",
            },
            {
              label: "Design",
              icon: "fa-solid fa-route",
              path: "/manager/tours/create",
            },
          ],
        },
        {
          label: "Transaction",
          icon: "fa-solid fa-shopping-cart",
          path: "/manager/transactions",
        },
        {
          label: "Withdraws",
          icon: "fa-solid fa-shopping-cart",
          path: "/manager/withdrawals",
        },
      ],
    },
  ];

  return (
    <CustomLayout
      menuItems={menuItems}
      title={title}
      onLanguageChange={() => alert("Ngôn ngữ đã thay đổi!")}
    >
      {children}
    </CustomLayout>
  );
};

export default ManagerLayout;
