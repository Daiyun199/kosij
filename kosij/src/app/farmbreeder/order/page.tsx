"use client";

import { ProColumns, ProTable } from "@ant-design/pro-components";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Space, Tag } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { fetchCurrentFarmOrders } from "@/features/farmbreeder/api/order/all.api";
const statusColors = {
  Pending: "default",
  Unpacked: "default",
  Packed: "blue",
  Shipping: "gold",
  Completed: "green",
  Canceled: "red",
};

type Order = {
  orderId: number;
  fullName: string;
  createdTime: string;
  expectedDeliveryDate: string;
  orderStatus: keyof typeof statusColors;
  totalAmount: number;
  paidAmount: number;
  remaining: number;
};

const columns: ProColumns<Order>[] = [
  {
    title: "ID",
    dataIndex: "orderId",
    key: "orderId",
    width: 98,
  },
  {
    title: "Customer Name",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Order Date",
    dataIndex: "createdTime",
    key: "createdTime",
  },
  {
    title: "Delivery Date (Expected)",
    dataIndex: "expectedDeliveryDate",
    key: "expectedDeliveryDate",
  },
  {
    title: "Status",
    dataIndex: "orderStatus",
    key: "orderStatus",
    render: (_, record: Order) => (
      <Tag color={statusColors[record.orderStatus]}>{record.orderStatus}</Tag>
    ),
  },
  {
    title: "Total",
    dataIndex: "totalAmount",
    key: "totalAmount",
    align: "right",
    render: (_, record: Order) => `${record.totalAmount.toLocaleString()} VND`,
  },
  {
    title: "Paid",
    dataIndex: "paidAmount",
    key: "paidAmount",
    align: "right",
    render: (_, record: Order) => (
      <span style={{ color: "green" }}>
        {record.paidAmount.toLocaleString()} VND
      </span>
    ),
  },
  {
    title: "Remaining",
    dataIndex: "remaining",
    key: "remaining",
    align: "right",
    render: (_, record: Order) => (
      <span style={{ color: record.remaining === 0 ? "black" : "red" }}>
        {record.remaining.toLocaleString()} VND
      </span>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    render: () => (
      <Space>
        <Button icon={<EyeOutlined />} />
        <Button icon={<EditOutlined />} />
      </Space>
    ),
  },
];

function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ["currentFarmOrders"],
    queryFn: fetchCurrentFarmOrders,
  });

  return (
    <PageContainer title="Orders List">
      <section className="mt-5">
        <ProTable<Order>
          columns={columns}
          dataSource={data}
          rowKey="orderId"
          search={false}
          pagination={{ pageSize: 5 }}
          loading={isLoading}
        />
      </section>
    </PageContainer>
  );
}

export default Page;
