import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["static.wikia.nocookie.net", "firebasestorage.googleapis.com"],
  },
  async rewrites() {
    return [
      {
        source: "/customer-list",
        destination: "/customerList",
      },
      {
        source: "/tour-list",
        destination: "/tourList",
      },

      {
        source: "/account-create",
        destination: "/accountCreate",
      },
      {
        source: "/tour-pending",
        destination: "/tourPending",
      },
      {
        source: "/dashboard/finance",
        destination: "/finance",
      },
      {
        source: "/dashboard/orders",
        destination: "/order",
      },
      {
        source: "/dashboard/tour",
        destination: "/tour",
      },
      {
        source: "/order-list",
        destination: "/orderList",
      },
      {
        source: "/tour-detail",
        destination: "/tourDetail",
      },
      {
        source: "/delivery-staff-list",
        destination: "/DList",
      },
      {
        source: "/",
        destination: "/login",
      },
    ];
  },
};

export default nextConfig;
