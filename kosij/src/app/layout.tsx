export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "./QueryProvider";
import { App as AntdApp } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./AuthProvider";
import NotificationIndicator from "./components/NotificationIndicator";
import { NotificationProvider } from "@/context/NotificationContext";
import NotificationManager from "./components/NotificationManager";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KOISJ",
  description: "KOISJ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            <NotificationProvider>
              <ToastContainer />
              <AntdApp>
                {children}
                <NotificationManager />
                <NotificationIndicator />
              </AntdApp>
            </NotificationProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
