import React from "react";
import "./Button.css";

interface CustomButtonProps {
  type?: "primary" | "secondary" | "danger" | "default";
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  type = "primary",
  onClick,
  children,
  disabled = false,
}) => {
  const buttonClass = `custom-button ${type} ${disabled ? "disabled" : ""}`;

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default CustomButton;
