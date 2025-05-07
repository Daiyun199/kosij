"use client";
import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  Table,
  Tag,
  Button,
  Modal,
  Input,
  message,
  Popconfirm,
  Descriptions,
  Popover,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "@/config/axios.config";
import { toast } from "react-toastify";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import ProtectedRoute from "@/app/ProtectedRoute";
import SearchBar from "@/app/components/SearchBar/SearchBar";

interface Withdrawal {
  id: number;
  walletId: number;
  amount: number;
  bankName: string;
  bankNumber: string;
  holderName: string;
  withdrawStatus: string;
  deniedReason: string;
}

interface ApiError {
  message: string;
  value: string;
}

const WithdrawalsTable: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [denyModalVisible, setDenyModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<Withdrawal | null>(null);
  const [deniedReason, setDeniedReason] = useState<string>("");

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ message: string; value: Withdrawal[] }>(
        "withdrawals"
      );
      const updatedData = response.data.value.map((item, index) => ({
        ...item,
        stt: index + 1,
      }));
      setData(updatedData);
    } catch (error) {
      handleApiError(error, "Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (error: unknown, defaultMessage: string) => {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.value) {
      toast.error(axiosError.response.data.value);
    } else {
      toast.error(defaultMessage);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/approve/withdrawal/${id}`, {
        isApproved: true,
        deniedReason: "",
      });
      message.success("Withdrawal approved successfully!");
      fetchWithdrawals();
    } catch (error) {
      handleApiError(error, "Failed to approve withdrawal");
    }
  };

  const handleDenyClick = (id: number) => {
    setSelectedId(id);
    setDenyModalVisible(true);
  };

  const handleViewDetails = (record: Withdrawal) => {
    setSelectedWithdrawal(record);
    setDetailModalVisible(true);
  };

  const handleConfirmDeny = async () => {
    if (!selectedId) return;
    try {
      await api.put(`approve/withdrawal/${selectedId}`, {
        isApproved: false,
        deniedReason,
      });
      message.success("Withdrawal denied successfully!");
      setDenyModalVisible(false);
      setDeniedReason("");
      fetchWithdrawals();
    } catch (error) {
      handleApiError(error, "Failed to deny withdrawal");
    }
  };

  const columns: ColumnsType<Withdrawal> = [
    { title: "STT", dataIndex: "stt", key: "stt" },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number) =>
        new Intl.NumberFormat("vi-VN").format(amount) + " VND",
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      sorter: (a, b) => a.bankName.localeCompare(b.bankName),
    },
    {
      title: "Bank Number",
      dataIndex: "bankNumber",
      key: "bankNumber",
      sorter: (a, b) => a.bankNumber.localeCompare(b.bankNumber),
    },
    { title: "Holder Name", dataIndex: "holderName", key: "holderName" },
    {
      title: "Status",
      dataIndex: "withdrawStatus",
      key: "withdrawStatus",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Canceled", value: "Canceled" },
        { text: "Success", value: "Success" },
        { text: "Failed", value: "Failed" },
      ],
      onFilter: (value, record) => record.withdrawStatus === value,
      render: (status) => {
        const statusColors: Record<string, string> = {
          Pending: "orange",
          Canceled: "volcano",
          Success: "green",
          Failed: "red",
        };

        return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Reason for Denial",
      dataIndex: "deniedReason",
      key: "deniedReason",
      render: (text: string) => {
        const MAX_LENGTH = 20;
        if (!text) return "-";
        return text.length > MAX_LENGTH ? (
          <Popover
            content={
              <div style={{ maxWidth: "400px", wordWrap: "break-word" }}>
                {text}
              </div>
            }
            title="Full Denial Reason"
            trigger="click"
          >
            <span style={{ cursor: "pointer" }}>
              {text.substring(0, MAX_LENGTH)}...
            </span>
          </Popover>
        ) : (
          text
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button onClick={() => handleViewDetails(record)}>View</Button>
          {record.withdrawStatus === "Pending" && (
            <>
              <Popconfirm
                title="Are you sure you want to approve this?"
                onConfirm={() => handleApprove(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary">Approve</Button>
              </Popconfirm>
              <Button danger onClick={() => handleDenyClick(record.id)}>
                Deny
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Withdrawals">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Typography.Title
            level={3}
            style={{ margin: 0, whiteSpace: "nowrap" }}
          >
            Withdrawal Requests
          </Typography.Title>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <SearchBar
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={data.filter((item) => {
            const keyword = searchValue.toLowerCase();
            return (
              item.walletId?.toString().toLowerCase().includes(keyword) ||
              item.bankName?.toLowerCase().includes(keyword) ||
              item.holderName?.toLowerCase().includes(keyword)
            );
          })}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />

        <Modal
          title="Deny Withdrawal"
          open={denyModalVisible}
          onCancel={() => setDenyModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setDenyModalVisible(false)}>
              Cancel
            </Button>,
            <Popconfirm
              key="confirm"
              title="Are you sure you want to deny this withdrawal?"
              onConfirm={handleConfirmDeny}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Confirm Denial</Button>
            </Popconfirm>,
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter reason for denial (max 100 characters)"
            value={deniedReason}
            onChange={(e) => setDeniedReason(e.target.value)}
            maxLength={100}
            showCount
          />
        </Modal>

        <Modal
          title="Withdrawal Details"
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={700}
        >
          {selectedWithdrawal && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="ID">
                {selectedWithdrawal.id}
              </Descriptions.Item>
              <Descriptions.Item label="Wallet ID" style={{ display: "none" }}>
                {selectedWithdrawal.walletId}
              </Descriptions.Item>

              <Descriptions.Item label="Amount">
                {new Intl.NumberFormat("vi-VN").format(
                  selectedWithdrawal.amount
                )}{" "}
                VND
              </Descriptions.Item>
              <Descriptions.Item label="Bank Name">
                {selectedWithdrawal.bankName}
              </Descriptions.Item>
              <Descriptions.Item label="Bank Number">
                {selectedWithdrawal.bankNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Holder Name">
                {selectedWithdrawal.holderName}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedWithdrawal.withdrawStatus === "Pending"
                      ? "orange"
                      : selectedWithdrawal.withdrawStatus === "Canceled"
                      ? "volcano"
                      : selectedWithdrawal.withdrawStatus === "Success"
                      ? "green"
                      : selectedWithdrawal.withdrawStatus === "Failed"
                      ? "red"
                      : "default"
                  }
                >
                  {selectedWithdrawal.withdrawStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Denial Reason">
                {selectedWithdrawal.deniedReason || "-"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </ManagerLayout>
    </ProtectedRoute>
  );
};

export default WithdrawalsTable;
