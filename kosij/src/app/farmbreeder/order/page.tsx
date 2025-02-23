"use client";

import {
  ProTable,
} from "@ant-design/pro-components";
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Space, Tag } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { ReactElement, JSXElementConstructor, ReactNode, AwaitedReactNode, ReactPortal } from "react";

const statusColors = {
  Unpacked: "default",
  Packed: "blue",
  Shipping: "gold",
  Completed: "green",
  Canceled: "red",
};

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
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
    title: "Delivery to Company (Expected)",
    dataIndex: "deliveryCompany",
    key: "deliveryCompany",
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
    render: (status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) => <Tag color={statusColors[status]}>{status}</Tag>,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    align: "right",
    render: (value: { toLocaleString: () => unknown; }) => `${value.toLocaleString()} VND`,
  },
  {
    title: "Paid",
    dataIndex: "paid",
    key: "paid",
    align: "right",
    render: (value: { toLocaleString: () => string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
      <span style={{ color: "green" }}>{value.toLocaleString()} VND</span>
    ),
  },
  {
    title: "Remaining",
    dataIndex: "remaining",
    key: "remaining",
    align: "right",
    render: (value: number) => (
      <span style={{ color: value === 0 ? "black" : "red" }}>
        {value.toLocaleString()} VND
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

const data = [
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
  // Add other rows following the same structure...
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
        <ProTable
          columns={columns}
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
