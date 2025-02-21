"use client";

import { PageContainer } from "@ant-design/pro-layout";
import { Button, Space, Statistic, Table } from "antd";
import ClickableArea from "@/app/components/ClickableArea";
import { cn } from "@/lib/utils/cn.util";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MoneyCollectOutlined,
  ShopOutlined,
  TeamOutlined,
  WalletOutlined,
} from "@ant-design/icons";

const columns = [
  {
    title: "Order ID",
    dataIndex: "orderId",
    key: "orderId",
    fixed: true,
  },
  {
    title: "Customer",
    dataIndex: "name",
    key: "name",
    fixed: true,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    fixed: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    fixed: true,
  },
];

const data = [
    { key: "1", orderId: "ORD001", name: "Alice Johnson", amount: 150.5, status: "Completed" },
    { key: "2", orderId: "ORD002", name: "Bob Smith", amount: 89.99, status: "Pending" },
    { key: "3", orderId: "ORD003", name: "Charlie Brown", amount: 210.75, status: "Shipped" },
    { key: "4", orderId: "ORD004", name: "Diana Ross", amount: 329.99, status: "Completed" },
    { key: "5", orderId: "ORD005", name: "Ethan Hunt", amount: 75.0, status: "Cancelled" },
  ];

function Page() {
  return (
    <PageContainer
      title="Dashboard"
      extra={
        <Space>
          <Button
            style={{
              borderRadius: "2rem",
              width: "5rem",
              borderColor: "#000000",
            }}
          >
            ENG
          </Button>
        </Space>
      }
      header={{
        style: {
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          background: "white",
          zIndex: 10,
        },
      }}
    >
      <section className={"mt-3 grid grid-cols-2 gap-3 px-layout pb-layout"}>
        <ClickableArea className={cn("block h-32 shadow-md p-4")}>
          <div className="flex items-start justify-between">
            <Statistic
              title={
                <span className="text-lg font-normal">Total Customers</span>
              }
              value={12}
              valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
            />
            <TeamOutlined className="text-blue-600 text-2xl cursor-pointer" />
          </div>
          <Statistic
            value={12}
            valueStyle={{ fontSize: "1rem", color: "green" }}
            prefix={<ArrowUpOutlined />}
            suffix="% from last month"
          />
        </ClickableArea>
        <ClickableArea className={cn("block h-32 shadow-md p-4")}>
          <div className="flex items-start justify-between">
            <Statistic
              title={<span className="text-lg font-normal">Total Orders</span>}
              value={12}
              valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
            />
            <ShopOutlined className="text-violet-500 text-2xl cursor-pointer" />
          </div>
          <Statistic
            value={12}
            valueStyle={{ fontSize: "1rem", color: "red" }}
            prefix={<ArrowDownOutlined />}
            suffix="% from last month"
          />
        </ClickableArea>
        <ClickableArea className={cn("block h-32 shadow-md p-4")}>
          <div className="flex items-start justify-between">
            <Statistic
              title={<span className="text-lg font-normal">Total Revenue</span>}
              value={12}
              valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
            />
            <WalletOutlined className="text-green-600 text-2xl cursor-pointer" />
          </div>
          <Statistic
            value={12}
            valueStyle={{ fontSize: "1rem", color: "green" }}
            prefix={<ArrowUpOutlined />}
            suffix="% from last month"
          />
        </ClickableArea>
        <ClickableArea className={cn("block h-32 shadow-md p-4")}>
          <div className="flex items-start justify-between">
            <Statistic
              title={
                <span className="text-lg font-normal">Total Withdrawals</span>
              }
              value={12}
              valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
            />
            <MoneyCollectOutlined className="text-orange-500 text-2xl cursor-pointer" />
          </div>
          <Statistic
            value={12}
            valueStyle={{ fontSize: "1rem", color: "green" }}
            prefix={<ArrowUpOutlined />}
            suffix="% from last month"
          />
        </ClickableArea>
      </section>
      <section className="mt-3">
        <h2 className="mt-5 mb-3 font-medium text-lg">Recent Orders</h2>
        <Table
          columns={columns}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
          dataSource={data}
        />
      </section>
    </PageContainer>
  );
}

export default Page;
