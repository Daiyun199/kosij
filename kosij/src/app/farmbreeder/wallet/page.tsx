/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ClickableArea from "@/app/components/ClickableArea";
import { PageContainer } from "@ant-design/pro-layout";
import {
  Button,
  //  Dropdown,
  Space,
  Statistic,
  Tag,
} from "antd";
import { cn } from "@/lib/utils/cn.util";
import { EyeOutlined, LogoutOutlined } from "@ant-design/icons";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { useState } from "react";
import WithdrawalModal from "@/features/farmbreeder/component/Withdrawal.modal";
import { useQuery } from "@tanstack/react-query";
import { fetchStatistics } from "@/features/farmbreeder/api/dashboard/all.api";
import { fetchTransaction } from "@/features/farmbreeder/api/wallet/all.api";
import dayjs from "dayjs";
import ProtectedRoute from "@/app/ProtectedRoute";

type TransactionItem = {
  id: number;
  transactionType: string;
  createdTime: string;
  transactor: string;
  amount: number;
  transactionStatus: string;
  url: string;
};

const columns: ProColumns<TransactionItem>[] = [
  {
    title: "Transaction ID",
    dataIndex: "id",
    valueType: "indexBorder",
  },
  {
    title: "Type",
    dataIndex: "transactionType",
    ellipsis: true,
  },
  {
    title: "Time",
    dataIndex: "createdTime",
    render: (_, record) =>
      record.createdTime
        ? dayjs(record.createdTime).format("DD-MM-YY, hh:mm")
        : "N/A",
  },
  {
    title: "Transactor",
    dataIndex: "transactor",
    ellipsis: true,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    render: (amount: any) => amount.toLocaleString(),
  },
  {
    title: "Status",
    dataIndex: "transactionStatus",
    render: (_, record) => {
      const statusColors: Record<
        "pending" | "success" | "failed" | "canceled",
        string
      > = {
        pending: "yellow",
        success: "green",
        failed: "red",
        canceled: "gray",
      };

      const color =
        statusColors[
          record.transactionStatus.toLowerCase() as keyof typeof statusColors
        ] || "blue";

      return <Tag color={color}>{record.transactionStatus.toUpperCase()}</Tag>;
    },
  },
  {
    title: "Actions",
    valueType: "option",
    render: (_, record) => [
      // eslint-disable-next-line react/jsx-key
      <a href={record.url} target="_blank" rel="noopener noreferrer">
        <EyeOutlined
          key="view"
          style={{ cursor: "pointer", alignContent: "center" }}
        />
      </a>,
    ],
  },
];

function Page() {
  // const actionRef = useRef<ActionType>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  const handleSubmit = (values: any) => {
    console.log("Form Submitted:", values);
    setIsModalOpen(false);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["farmStatistics"],
    queryFn: fetchStatistics,
    staleTime: 5000,
  });

  const {
    data: transactions = [],
    isLoading: transactionLoading,
    isError: transactionError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransaction,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  const formatNumber = (num: { toString: () => string }) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  console.log("Transactions Data:", transactions);

  return (
    <ProtectedRoute allowedRoles={["farmbreeder"]}>
      <PageContainer
        title="Your Wallet"
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
          <ClickableArea className={cn("block h-40 shadow-md p-4")}>
            <div className="flex items-start justify-between">
              <Statistic
                title={
                  <span className="text-lg font-normal">Current Balance</span>
                }
                value={`${formatNumber(data.currentBalance)} VND`}
                valueStyle={{ fontSize: "1.5rem", fontWeight: "bold" }}
              />
              Last Updated: 2 mins ago
            </div>
            <Button
              className="mt-5 w-40"
              icon={<LogoutOutlined />}
              style={{ backgroundColor: "#2563EB", color: "#fff" }}
              onClick={handleOpen}
            >
              Withdraw
            </Button>
          </ClickableArea>
        </section>
        <section className="mt-5">
          {transactionLoading ? (
            <div>Loading transactions...</div>
          ) : transactionError ? (
            <div>Error fetching transactions.</div>
          ) : transactions.length > 0 ? (
            <ProTable<TransactionItem>
              columns={columns}
              dataSource={transactions}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showTotal: (total) => `Total ${total} records`,
              }}
              headerTitle="Recent Transactions"
              search={false}
            />
          ) : (
            <div>No transactions found.</div>
          )}
        </section>

        <WithdrawalModal
          visible={isModalOpen}
          onCancel={handleClose}
          onSubmit={handleSubmit}
        />
      </PageContainer>
    </ProtectedRoute>
  );
}

export default Page;
