"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./Layout.css";
import useLogout from "@/lib/domain/User/useLogout";

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
  const pathname = usePathname();
  const [activePath, setActivePath] = useState<string>("");
  const [expandedMenus, setExpandedMenus] = useState<{
    [key: string]: boolean;
  }>({});
  const [handleLogout] = useLogout()
  useEffect(() => {
    const savedPath = localStorage.getItem("activePath") || pathname;
    setActivePath(savedPath);

    const savedExpanded = localStorage.getItem("expandedMenus");
    if (savedExpanded) {
      setExpandedMenus(JSON.parse(savedExpanded));
    }
  }, [pathname]);

  const handleNavigate = (path?: string) => {
    if (path) {
      setActivePath(path);
      localStorage.setItem("activePath", path);
      router.push(path);
    }
  };

  const toggleMenu = (path: string) => {
    setExpandedMenus((prev) => {
      const updated = { ...prev, [path]: !prev[path] };
      localStorage.setItem("expandedMenus", JSON.stringify(updated));
      return updated;
    });
  };

  const renderMenu = (items: MenuItem[], parentPath = "") => {
    return items.map((item) => {
      const path = item.path || `${parentPath}/${item.label}`;
      const hasChildren = item.children && item.children.length > 0;
      const isActive = activePath === path;
      const isExpanded = expandedMenus[path] || false;

      return (
        <div key={path} className={`menu-item ${isExpanded ? "expanded" : ""}`}>
          <div
            className={`menu-label ${isActive ? "active" : ""}`}
            onClick={() =>
              hasChildren ? toggleMenu(path) : handleNavigate(path)
            }
          >
            {item.icon && <i className={item.icon} />}
            <span>{item.label}</span>
            {hasChildren && (
              <span className="expand-icon">
                {isExpanded ? (
                  <i className="fa-solid fa-chevron-up"></i>
                ) : (
                  <i className="fa-solid fa-chevron-down"></i>
                )}
              </span>
            )}
          </div>
          {hasChildren && isExpanded && (
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
          <button className="sign-out" onClick={handleLogout} >Sign Out</button>
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
