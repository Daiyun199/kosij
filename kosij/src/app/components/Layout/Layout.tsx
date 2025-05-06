"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./Layout.css";
import useLogout from "@/lib/domain/User/useLogout";
import Image from "next/image";
interface MenuItem {
  label: string;
  icon?: string;
  children?: MenuItem[];
  path?: string;
}

interface LayoutProps {
  menuItems: MenuItem[];
  title: React.ReactNode;
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
  const [handleLogout] = useLogout();
  useEffect(() => {
    const savedPath = sessionStorage.getItem("activePath") || pathname;
    setActivePath(savedPath);

    const savedExpanded = sessionStorage.getItem("expandedMenus");
    if (savedExpanded) {
      setExpandedMenus(JSON.parse(savedExpanded));
    }
  }, [pathname]);

  const handleNavigate = (path?: string) => {
    if (path) {
      setActivePath(path);
      sessionStorage.setItem("activePath", path);
      router.push(path);
    }
  };

  const toggleMenu = (path: string) => {
    setExpandedMenus((prev) => {
      const updated = { ...prev, [path]: !prev[path] };
      sessionStorage.setItem("expandedMenus", JSON.stringify(updated));
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

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Image src="/logo.png" alt="Logo" width={50} height={5} />
          <div className="logo">KOSIJ</div>
        </div>
        <nav className="menu">{renderMenu(menuItems)}</nav>
        <div className="sidebar-footer">
          <button className="sign-out" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div className="header-left">
            <button className="back-btn" onClick={handleBackClick}>
              &larr;
            </button>
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
