"use client";
import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Table, Tag, Button, Modal, Input, message, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "@/config/axios.config";
import { toast } from "react-toastify";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";

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
  const [data, setData] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
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
    setModalVisible(true);
  };

  const handleConfirmDeny = async () => {
    if (!selectedId) return;
    try {
      await api.put(`approve/withdrawal/${selectedId}`, {
        isApproved: false,
        deniedReason,
      });
      message.success("Withdrawal denied successfully!");
      setModalVisible(false);
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
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          {record.withdrawStatus === "Pending" && (
            <>
              <Button
                type="primary"
                onClick={() => handleApprove(record.id)} // Vẫn truyền ID
                className="mr-2"
              >
                Approve
              </Button>
              <Button danger onClick={() => handleDenyClick(record.id)}>
                Deny
              </Button>
            </>
          )}
        </>
      ),
    },
  ];
  return (
    <>
      <ManagerLayout title="Withdrawals">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />

        <Modal
          title="Deny Withdrawal"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setModalVisible(false)}>
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
            placeholder="Enter reason for denial"
            value={deniedReason}
            onChange={(e) => setDeniedReason(e.target.value)}
          />
        </Modal>
      </ManagerLayout>
    </>
  );
};

export default WithdrawalsTable;
