"use client";

import {
  ProColumns,
  ProTable,
} from "@ant-design/pro-components";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Space, Tag } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";

const statusColors = {
  Unpacked: "default",
  Packed: "blue",
  Shipping: "gold",
  Completed: "green",
  Canceled: "red",
};

type Order = {
  id: string;
  tripName: string;
  customerName: string;
  orderDate: string;
  deliveryCompany: string;
  deliveryCustomer: string;
  status: keyof typeof statusColors;
  total: number;
  paid: number;
  remaining: number;
};


const columns: ProColumns<Order>[] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 98,
  },
  {
    title: "Trip Name",
    dataIndex: "tripName",
    key: "tripName",
  },
  {
    title: "Customer Name",
    dataIndex: "customerName",
    key: "customerName",
  },
  {
    title: "Order Date",
    dataIndex: "orderDate",
    key: "orderDate",
  },
  {
    title: "Delivery to Customer (Expected)",
    dataIndex: "deliveryCustomer",
    key: "deliveryCustomer",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (_, record: Order) => <Tag color={statusColors[record.status]}>{record.status}</Tag>,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    align: "right",
    render: (_, record: Order) => `${record.total.toLocaleString()} VND`,
  },
  {
    title: "Paid",
    dataIndex: "paid",
    key: "paid",
    align: "right",
    render: (_, record: Order) => (
      <span style={{ color: "green" }}>{record.paid.toLocaleString()} VND</span>
    ),  },
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

const data: Order[] = [
  {
    id: "ORD-12345",
    tripName: "Paris Spring Tour",
    customerName: "John Doe",
    orderDate: "Jan 15, 2025",
    deliveryCompany: "Feb 01, 2025",
    deliveryCustomer: "Feb 15, 2025",
    status: "Unpacked",
    total: 71000000,
    paid: 56800000,
    remaining: 14200000,
  },
  {
    id: "ORD-12345",
    tripName: "Paris Spring Tour",
    customerName: "John Doe",
    orderDate: "Jan 15, 2025",
    deliveryCompany: "Feb 01, 2025",
    deliveryCustomer: "Feb 15, 2025",
    status: "Packed",
    total: 71000000,
    paid: 56800000,
    remaining: 14200000,
  },
  {
    id: "ORD-12345",
    tripName: "Paris Spring Tour",
    customerName: "John Doe",
    orderDate: "Jan 15, 2025",
    deliveryCompany: "Feb 01, 2025",
    deliveryCustomer: "Feb 15, 2025",
    status: "Shipping",
    total: 71000000,
    paid: 56800000,
    remaining: 14200000,
  },
  {
    id: "ORD-12345",
    tripName: "Paris Spring Tour",
    customerName: "John Doe",
    orderDate: "Jan 15, 2025",
    deliveryCompany: "Feb 01, 2025",
    deliveryCustomer: "Feb 15, 2025",
    status: "Shipping",
    total: 71000000,
    paid: 56800000,
    remaining: 14200000,
  },
  {
    id: "ORD-12345",
    tripName: "Paris Spring Tour",
    customerName: "John Doe",
    orderDate: "Jan 15, 2025",
    deliveryCompany: "Feb 01, 2025",
    deliveryCustomer: "Feb 15, 2025",
    status: "Completed",
    total: 71000000,
    paid: 56800000,
    remaining: 14200000,
  },
  {
    id: "ORD-12345",
    tripName: "Paris Spring Tour",
    customerName: "John Doe",
    orderDate: "Jan 15, 2025",
    deliveryCompany: "Feb 01, 2025",
    deliveryCustomer: "Feb 15, 2025",
    status: "Canceled",
    total: 71000000,
    paid: 56800000,
    remaining: 14200000,
  },
];

function Page() {
  return (
    <PageContainer
      title="Orders List"
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
      <section className="mt-5">
        <ProTable<Order>
          columns={columns as ProColumns<Order>[]}
          dataSource={data}
          rowKey="id"
          search={false}
          pagination={{ pageSize: 5 }}
        />
      </section>
    </PageContainer>
  );
}

export default Page;
