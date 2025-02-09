import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["static.wikia.nocookie.net"],
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
        source: "/staff-list",
        destination: "/staffList",
      },
      {
        source: "/staff-create",
        destination: "/staffCreate",
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
    ];
  },
};

export default nextConfig;
