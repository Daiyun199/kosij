"use client";

import { Dropdown } from "antd";
import {
  BellOutlined,
  DashboardOutlined,
  FileTextOutlined,
  InboxOutlined,
  LogoutOutlined,
  ProductOutlined,
  SettingOutlined,
  ShopOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import Link from "next/link";
import { ProLayout } from "@ant-design/pro-layout";
import { PropsWithChildren } from "react";
import { usePathname, useRouter } from "next/navigation";

function RightNavbar({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ProLayout
      className="custom-prolayout"
      isChildrenLayout={false}
      contentWidth="Fixed"
      contentStyle={{
        width: "auto",
        fontSize: "18px"
      }}
      location={{
        pathname,
      }}
      token={{
        sider: {
          colorTextMenuTitle: "#fff",
          colorMenuBackground: "#002fa7",
          colorTextMenu: "#fff",
          colorTextMenuSelected: "#ffffff",
          colorBgMenuItemSelected: "#afbee4",
          colorBgMenuItemHover: "#afbee4",
          colorMenuItemDivider: "#fff",
          colorTextMenuSecondary: "#ffffff",
          colorTextMenuItemHover: "#fff",
          colorTextSubMenuSelected: "#fff"
        },
      }}
      bgLayoutImgList={[
        {
          src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
          left: 85,
          bottom: 100,
          height: "303px",
        },
        {
          src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
          bottom: -68,
          right: -45,
          height: "303px",
        },
        {
          src: "https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png",
          bottom: 0,
          left: 0,
          width: "331px",
        },
      ]}
      siderMenuType="group"
      menu={{
        collapsedShowGroupTitle: true,
      }}
      avatarProps={{
        src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
        title: "Farm Breeder",
        className: "cursor-pointer",
        render: (_, dom) => {
          return (
            <Dropdown
              className="w-full cursor-pointer"
              menu={{
                items: [
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "Sign out",
                    danger: true,
                    onClick: () => {
                      router.push("/login?logout=success");
                      Cookies.remove("token");
                    },
                  },
                  {
                    key: "settings",
                    icon: <SettingOutlined />,
                    label: "Profile",
                  },
                ],
              }}
            >
              {dom}
            </Dropdown>
          );
        },
      }}
      logo={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <img src="/logo.png" alt="Logo" style={{ width: 50, height: 50 }} />
          <span style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
            KOSIJ
          </span>
        </div>
      }
      title={false}
      layout="side"
      fixSiderbar={true}
      onMenuHeaderClick={() => router.push("/farmbreeder")}
      route={{
        routes: [
          {
            key: "general",
            name: "General",
            children: [
              {
                key: "dashboard",
                path: "farmbreeder/dashboard",
                name: "Dashboard",
                icon: <DashboardOutlined />,
              },
              {
                key: "reviews",
                path: "farmbreeder/dashboard",
                name: "Ratings & Reviews",
                icon: <InboxOutlined />,
              },
              {
                key: "wallet",
                path: "farmbreeder/dashboard",
                name: "Wallet",
                icon: <WalletOutlined />,
              },
              {
                key: "notification",
                path: "farmbreeder/dashboard",
                name: "Notifications",
                icon: <BellOutlined />,
              },
            ],
          },
          {
            key: "data management",
            name: "Management",
            children: [
              {
                key: "tracking",
                name: "Trips Tracking",
                icon: <ProductOutlined />,
                path: "farmbreeder/request",
              },
              {
                key: "order",
                name: "Order",
                icon: <ShopOutlined />,
                path: "farmbreeder/task",
              },
              {
                key: "variety",
                name: "Variety",
                icon: <FileTextOutlined />,
                path: "farmbreeder/task",
              },
            ],
          },
        ],
      }}
      onError={() => {
        console.log("Hi error");
      }}
      menuItemRender={(item, dom) => (
        <Link href={item.path ?? "/farmbreeder/dashboard"}>{dom}</Link>
      )}
    >
      {children}
    </ProLayout>
  );
}

export default RightNavbar;
