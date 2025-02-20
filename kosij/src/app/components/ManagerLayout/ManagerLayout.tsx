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
        { label: "Profile", icon: "fa-solid fa-user", path: "/profile" },
        {
          label: "Dashboard",
          icon: "fa-solid fa-chart-pie",
          path: "/dashboard",
          children: [
            {
              label: "Finance",
              icon: "fa-solid fa-money-bill-wave",
              path: "/dashboard/finance",
            },
            {
              label: "Order",
              icon: "fa-solid fa-box",
              path: "/dashboard/orders",
            },
            {
              label: "Tour",
              icon: "fa-solid fa-umbrella-beach",
              path: "/dashboard/tour",
            },
          ],
        },
        {
          label: "Notifications",
          icon: "fa-solid fa-bell",
          path: "/notification",
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
              path: "/customer-list",
            },
            {
              label: "Sale Staff",
              icon: "fa-solid fa-headphones",
              path: "/sale-staff-list",
            },
            {
              label: "Delivery Staff",
              icon: "fa-solid fa-truck-fast",
              path: "/delivery-staff-list",
            },
            {
              label: "Fram Breeder",
              icon: "fa-solid fa-fish-fins",
              path: "/farm-breeder-list",
            },
            {
              label: "Consultant Staff",
              icon: "fa-solid fa-user-tie",
              path: "/consultant-staff-list",
            },
            {
              label: "Register",
              icon: "fa-solid fa-user-plus",
              path: "/account-create",
            },
          ],
        },
        {
          label: "Order",
          icon: "fa-solid fa-shopping-cart",
          path: "/order-list",
        },
        {
          label: "Tour",
          icon: "fa-solid fa-map",
          children: [
            { label: "List", icon: "fa-solid fa-list", path: "/tour-list" },
            {
              label: "Pending",
              icon: "fa-solid fa-hourglass",
              path: "/tour-pending",
            },
            { label: "Cancel", icon: "fa-solid fa-ban", path: "/tour-cancel" },
          ],
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
