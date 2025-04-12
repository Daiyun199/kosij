"use client";
import React from "react";
import CustomLayout from "@/app/components/Layout/Layout";

interface SaleStaffLayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const SaleStaffLayout: React.FC<SaleStaffLayoutProps> = ({
  title,
  children,
}) => {
  const menuItems = [
    {
      label: "General",
      icon: "fa-solid fa-house",
      children: [
        {
          label: "Profile",
          icon: "fa-solid fa-user",
          path: "/sale-staff/profile",
        },
        {
          label: "Dashboard",
          icon: "fa-solid fa-chart-pie",
          path: "/sale/dashboard",
        },
        {
          label: "Notifications",
          icon: "fa-solid fa-bell",
          path: "/sale/notification",
        },
      ],
    },
    {
      label: "Management",
      icon: "fa-solid fa-cogs",
      children: [
        {
          label: "Trip Request",
          icon: "fa-solid fa-clipboard-list",
          path: "/sale/requests",
        },
        {
          label: "Scheduled Trip",
          icon: "fa-solid fa-calendar-check",
          path: "/sale/scheduled/trips",
        },
        {
          label: "Custom Trip",
          icon: "fa-solid fa-map-marked-alt",
          path: "/sale/custom/trips",
        },
        {
          label: "Rejected Trip",
          icon: "fa-solid fa-clipboard-list",
          path: "/sale/rejected",
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

export default SaleStaffLayout;
