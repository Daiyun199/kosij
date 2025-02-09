import { LocaleProvider } from "@/context/LocaleProvider";
import "antd/dist/antd.css";
import { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const locale = pageProps.locale || "vi-VN";
  return (
    <LocaleProvider initialLocale={locale}>
      <Component {...pageProps} />
    </LocaleProvider>
  );
};

export default MyApp;
