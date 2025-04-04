/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Button, DatePicker, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "@/config/axios.config";
import dayjs from "dayjs";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import isBetween from "dayjs/plugin/isBetween";
import ProtectedRoute from "@/app/ProtectedRoute";
dayjs.extend(isBetween);

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
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);

  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchValue, dateRange, orders]);

  const statusFilters = [
    { text: "Pending", value: "Pending" },
    { text: "Deposited", value: "Deposited" },
    { text: "Packaged", value: "Packaged" },
    { text: "Delivering", value: "Delivering" },
    { text: "Delivered", value: "Delivered" },
    { text: "Cancelled by Company", value: "CancelledbyCompany" },
    { text: "Cancelled by Customer", value: "CancelledbyCustomer" },
    { text: "Pending Refund", value: "PendingRefund" },
    { text: "Refunded", value: "Refunded" },
  ];

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

  const applyFilters = () => {
    let filteredData = [...orders];

    if (searchValue.trim()) {
      filteredData = filteredData.filter(
        (order) =>
          order.fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
          order.phoneNumber.includes(searchValue) ||
          order.id.toString().includes(searchValue)
      );
    }

    if (dateRange[0] && dateRange[1]) {
      filteredData = filteredData.filter((order) => {
        const orderDate = dayjs(order.expectedDeliveryDate);
        return orderDate.isBetween(dateRange[0], dateRange[1], "day", "[]");
      });
    }

    setFilteredOrders(filteredData);
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Customer Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    {
      title: "Total Amount",
      dataIndex: "totalOrderAmount",
      key: "totalOrderAmount",
      sorter: (a, b) => a.totalOrderAmount - b.totalOrderAmount,
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
      sorter: (a, b) => a.paidAmount - b.paidAmount,
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Remaining Amount",
      dataIndex: "remaining",
      key: "remaining",
      sorter: (a, b) => a.remaining - b.remaining,
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Delivery Date",
      dataIndex: "expectedDeliveryDate",
      key: "expectedDeliveryDate",
      sorter: (a, b) =>
        new Date(a.expectedDeliveryDate).getTime() -
        new Date(b.expectedDeliveryDate).getTime(),
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      filters: statusFilters,
      onFilter: (value, record) => record.orderStatus === value,
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
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Orders List">
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <SearchBar
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <DatePicker.RangePicker
            onChange={(dates) =>
              setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])
            }
          />
        </div>
        <div className="p-4">
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
};

export default OrdersPage;
