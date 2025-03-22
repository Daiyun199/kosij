/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "@/config/axios.config";

import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { useRouter } from "next/navigation";

interface Order {
  id: number;
  fullName: string;
  phoneNumber: string;
  totalOrderAmount: number;
  paidAmount: number;
  remaining: number;
  expectedDeliveryDate: string;
  orderStatus: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("orders");
      setOrders(response.data.value);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Total Amount",
      dataIndex: "totalOrderAmount",
      key: "totalOrderAmount",
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Remaining Amount",
      dataIndex: "remaining",
      key: "remaining",
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Delivery Date",
      dataIndex: "expectedDeliveryDate",
      key: "expectedDeliveryDate",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Order) => (
        <Button
          type="primary"
          onClick={() => router.push(`/manager/orders/${record.id}`)}
        >
          Detail
        </Button>
      ),
    },
  ];

  return (
    <ManagerLayout title="Orders List">
      <div className="p-4">
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </ManagerLayout>
  );
};

export default OrdersPage;
