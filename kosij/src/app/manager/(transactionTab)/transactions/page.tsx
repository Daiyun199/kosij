/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { Table, DatePicker, Card, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import api from "@/config/axios.config";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { Transaction } from "@/model/Transaction";
import ProtectedRoute from "@/app/ProtectedRoute";

const { RangePicker } = DatePicker;

const transactionTypes = [
  "None",
  "Wallet Top Up",
  "Wallet Withdraw",
  "Trip Booking Deposit",
  "Trip Booking Final Payment",
  "Order Deposit",
  "Order Final Payment",
  "Refund Trip Cancellation",
  "Refund Order Cancellation",
  "Commission Payment",
];

const transactionStatuses = [
  "Incomplete",
  "Pending",
  "Success",
  "Failed",
  "Canceled",
];

const formatTransactionType = (type: string) => {
  return type.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [dateRange, transactions]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get("transactions");

      const formattedData = response.data.value.map(
        (transaction: Transaction) => ({
          ...transaction,
          transactionType: formatTransactionType(transaction.transactionType),
        })
      );

      setTransactions(formattedData);
      setFilteredTransactions(formattedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      setFilteredTransactions(transactions);
      return;
    }

    const [startDate, endDate] = dateRange;
    const filtered = transactions.filter((transaction) => {
      const transactionDate = dayjs(transaction.createdTime);
      return (
        transactionDate.isAfter(startDate) &&
        transactionDate.isBefore(endDate.add(1, "day")) // Include the end date
      );
    });

    setFilteredTransactions(filtered);
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType",
      filters: transactionTypes.map((type) => ({ text: type, value: type })),
      onFilter: (value, record) => record.transactionType === value.toString(),
    },
    {
      title: "Document ID",
      dataIndex: "docId",
      key: "docId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number) =>
        new Intl.NumberFormat("vi-VN").format(amount) + " VND",
    },
    {
      title: "Transaction Status",
      dataIndex: "transactionStatus",
      key: "transactionStatus",
      filters: transactionStatuses.map((status) => ({
        text: status,
        value: status,
      })),
      onFilter: (value, record) =>
        record.transactionStatus === value.toString(),
    },
    {
      title: "Created Time",
      dataIndex: "createdTime",
      key: "createdTime",
      sorter: (a, b) =>
        new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime(),
      render: (createdTime: string) => new Date(createdTime).toLocaleString(),
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Transaction's List">
        <div className="p-4">
          <Card>
            <Space style={{ marginBottom: 16 }}>
              <RangePicker
                onChange={(dates) =>
                  setDateRange(
                    dates as [dayjs.Dayjs | null, dayjs.Dayjs | null]
                  )
                }
                format="DD/MM/YYYY"
                style={{ width: 250 }}
              />
            </Space>

            <Table
              columns={columns}
              dataSource={filteredTransactions}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              loading={loading}
            />
          </Card>
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
};

export default TransactionsTable;
