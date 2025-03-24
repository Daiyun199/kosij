/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "@/config/axios.config";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { Transaction } from "@/model/Transaction";

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
  return type.replace(/([a-z])([A-Z])/g, "$1 $2"); // Add space before uppercase letters
};

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
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
    }
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
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
      render: (amount: number) => `$${amount.toFixed(2)}`,
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
      render: (createdTime: string) => new Date(createdTime).toLocaleString(),
    },
  ];

  return (
    <ManagerLayout title="Transaction's List">
      <div className="p-4">
        <Table
          columns={columns}
          dataSource={filteredTransactions}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </ManagerLayout>
  );
};

export default TransactionsTable;
