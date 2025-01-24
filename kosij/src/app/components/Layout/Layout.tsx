"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import "./Layout.css";

interface MenuItem {
  label: string;
  icon?: string;
  children?: MenuItem[];
  path?: string;
}

interface LayoutProps {
  menuItems: MenuItem[];
  title: string;
  onLanguageChange?: () => void;
  children?: React.ReactNode;
}

const CustomLayout: React.FC<LayoutProps> = ({
  menuItems,
  title,
  onLanguageChange,
  children,
}) => {
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const generatePath = (parentPath: string, label: string): string => {
    return parentPath ? `${parentPath}/${label}` : label;
  };

  const toggleMenu = (path: string) => {
    setOpenMenus((prev) =>
      prev.includes(path)
        ? prev.filter((item) => item !== path)
        : [...prev, path]
    );
  };

  const handleNavigate = (path?: string) => {
    if (path) {
      router.push(path); // Điều hướng đến đường dẫn
    }
  };

  const renderMenu = (items: MenuItem[], parentPath = "") => {
    return items.map((item) => {
      const path = generatePath(parentPath, item.label);
      const hasChildren = item.children && item.children.length > 0;

      return (
        <div key={path} className="menu-item">
          <div
            className="menu-label"
            onClick={() =>
              hasChildren ? toggleMenu(path) : handleNavigate(item.path)
            }
          >
            {item.icon && <i className={item.icon} />}
            <span>{item.label}</span>
          </div>
          {hasChildren && openMenus.includes(path) && (
            <div className="submenu">{renderMenu(item.children!, path)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="Logo" />
          <div className="logo">KOSIJ</div>
        </div>
        <nav className="menu">{renderMenu(menuItems)}</nav>
        <div className="sidebar-footer">
          <button className="sign-out">Sign Out</button>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div className="header-left">
            <button className="back-btn">&larr;</button>
            <div className="title">{title}</div>
          </div>
          <button className="lang-btn" onClick={onLanguageChange}>
            EN
          </button>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
};

export default CustomLayout;
