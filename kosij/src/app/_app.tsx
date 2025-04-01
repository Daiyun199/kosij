"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App, ConfigProvider } from "antd";
import { AppProps } from "next/app";
import { useRef } from "react";
import "@/styles/globals.css";
import Head from "next/head";
// import { AuthProvider } from "./AuthProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  const queryClientRef = useRef(new QueryClient());

  return (
    // <AuthProvider>
      <QueryClientProvider client={queryClientRef.current}>
        <ConfigProvider>
          <App>
            <Head>
              <title>KOISJ</title>
            </Head>
            <Component {...pageProps} />
          </App>
        </ConfigProvider>
      </QueryClientProvider>
    // </AuthProvider>
  );
}
