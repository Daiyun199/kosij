import React, { createContext, ReactNode, useContext } from "react";

type LocaleContextType = {
  locale: string;
  formatNumber: (num: number) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: string;
}) => {
  const locale = initialLocale || "vi-VN";

  const formatNumber = (num: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "VND",
    }).format(num);

  return (
    <LocaleContext.Provider value={{ locale, formatNumber }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
