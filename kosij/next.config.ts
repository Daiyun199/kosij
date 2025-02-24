import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/manager/customer-list",
        destination: "/manager/customerList",
      },

      {
        source: "/manager/account-create",
        destination: "/manager/accountCreate",
      },
      { source: "/manager/tour-pending", destination: "/manager/tourPending" },
      { source: "/manager/dashboard/finance", destination: "/manager/finance" },
      { source: "/manager/dashboard/orders", destination: "/manager/order" },
      { source: "/manager/dashboard/tour", destination: "/manager/tour" },
      { source: "/manager/order-list", destination: "/manager/orderList" },
      { source: "/manager/tour-detail", destination: "/manager/tourDetail" },
      { source: "/manager/delivery-staff-list", destination: "/manager/DList" },
      { source: "/", destination: "/login" },
    ];
  },
};

export default nextConfig;
