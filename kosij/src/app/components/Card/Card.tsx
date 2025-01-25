"use-client";
import React from "react";
import classNames from "classnames";
import "./Card.css";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={classNames("card", className)}>{children}</div>
);

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
}) => (
  <div
    className={classNames(
      "card-header",
      "font-semibold text-lg mb-2 text-center",
      className
    )}
  >
    {children}
  </div>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => (
  <div
    className={classNames("card-content", "text-sm text-gray-700", className)}
  >
    {children}
  </div>
);
