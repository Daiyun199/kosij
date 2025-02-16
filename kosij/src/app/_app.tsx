import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProps } from "next/app";
import { useRef } from "react";
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const queryClientRef = useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
