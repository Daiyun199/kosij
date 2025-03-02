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
import api from "@/config/axios.config";
import { useQuery } from "@tanstack/react-query";

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

const fetchStatistics = async () => {
  const response = await api.get("/farm-variety/statistics/current-farm", {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJGQVItMDAxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiRmFybUJyZWVkZXIiLCJleHAiOjE3NDEwMjYyODZ9.kP7UYrXoQIa1NpC6H9LGe_MsY057B17ltluwe8r6-5Q`,
      Accept: "text/plain",
    },
  });
  console.log("API Response:", response.data); // Check the structure

  return response.data.value;
};

function Page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["farmStatistics"],
    queryFn: fetchStatistics,
  });

  const statistics = data || { totalOrders: {}, totalCustomers: 0, totalRevenue: 0, currentBalance: 0 };

  const totalOrders = statistics.totalOrders ?? {};
  const totalCustomers = statistics.totalCustomers ?? 0;
  const totalRevenue = statistics.totalRevenue ?? 0;
  const currentBalance = statistics.currentBalance ?? 0;

  const totalOrderCount =
    (totalOrders.totalPendingOrders ?? 0) +
    (totalOrders.totalCompletedOrders ?? 0) +
    (totalOrders.totalCanceledOrders ?? 0);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;
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
              value={totalCustomers}
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
              value={totalOrderCount}
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
              value={totalRevenue}
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
              value={currentBalance}
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
