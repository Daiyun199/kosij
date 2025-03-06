import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.wikia.nocookie.net" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "sieuthicakoi.vn" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "cdn0497.cdn4s.com" },
      { protocol: "https", hostname: "www.pondexperts.ca" },
      { protocol: "https", hostname: "rinkoonline.com" },
      { protocol: "https", hostname: "visinhcakoi.com" },
    ],
  },

  async rewrites() {
    return [
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
    ];
  },
};

export default nextConfig;
