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
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "japan.net.vn" },
      { protocol: "https", hostname: "traveltop.vn" },
      { protocol: "https", hostname: "th.bing.com" },
      { protocol: "https", hostname: "s.elib.vn" },
      { protocol: "https", hostname: "traicagiong.com" },
      { protocol: "https", hostname: "toyomakoi.com" },
      { protocol: "https", hostname: "daotaoceo.net" },
      { protocol: "https", hostname: "lptech.asia" },
      { protocol: "https", hostname: "tuyensinh24h.org" },
      { protocol: "https", hostname: "giaypheplaixe.edu.vn" },
      { protocol: "https", hostname: "cakoiviethuan.com" },
      { protocol: "https", hostname: "bizweb.dktcdn.net" },
      { protocol: "https", hostname: "cakoibienhoa.com" },
      { protocol: "https", hostname: "minhxuankoifarm.com" },
      { protocol: "https", hostname: "ishikoi.vn" },
      { protocol: "https", hostname: "theoakskoifarm.com" },
      { protocol: "https", hostname: "askoi.vn" },
      { protocol: "https", hostname: "hoangkhoikoifish.com" },
      { protocol: "https", hostname: "cacanhthaihoa.com" },
      { protocol: "https", hostname: "images.koiauction1.com" },
      { protocol: "https", hostname: "aquariumcare.vn" },
      { protocol: "https", hostname: "grandkoi.com" },
      { protocol: "https", hostname: "example.com" },
      { protocol: "https", hostname: "lptech.asia" },
      { protocol: "https", hostname: "th.bing.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
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
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
      {
        source: "/login",
        destination: "/login",
        permanent: false,
        has: [
          {
            type: "cookie",
            key: "authToken",
            value: "undefined",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
