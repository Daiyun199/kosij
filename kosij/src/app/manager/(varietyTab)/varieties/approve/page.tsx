/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Tooltip,
  Modal,
  Descriptions,
  Image,
  Popconfirm,
  Input,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "@/config/axios.config";
import { toast } from "react-toastify";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import ProtectedRoute from "@/app/ProtectedRoute";

interface Farm {
  id: number;
  farmName: string;
}

interface KoiVariety {
  id: number;
  varietyName: string;
  description: string;
  imageUrl: string;
  status: boolean;
  createdBy: string;
  createdTime: string;
  farm: Farm;
}

const KoiVarietiesPage: React.FC = () => {
  const [allData, setAllData] = useState<KoiVariety[]>([]);
  const [currentPageData, setCurrentPageData] = useState<KoiVariety[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [selectedRecord, setSelectedRecord] = useState<KoiVariety | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [denyModalVisible, setDenyModalVisible] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/new-koi-varieties");
      setAllData(response.data.value);
      setPagination({
        ...pagination,
        total: response.data.value.length,
      });
      updateCurrentPageData(response.data.value, 1);
    } catch (error) {
      toast.error("No varieties need approval");
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentPageData = (data: KoiVariety[], page: number) => {
    const startIndex = (page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    setCurrentPageData(data.slice(startIndex, endIndex));
  };

  const handleTableChange = (page: number) => {
    updateCurrentPageData(allData, page);
    setPagination({
      ...pagination,
      current: page,
    });
  };

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/approve/koi-variety/${id}`, {
        isApproved: true,
        reason: "Good",
      });
      toast.success("Koi variety approved successfully");
      fetchData();
    } catch (error) {
      toast.error("No varieties need approval");
    }
  };

  const showDenyModal = (id: number) => {
    setSelectedId(id);
    setDenyModalVisible(true);
  };

  const handleDenyConfirm = async () => {
    if (!selectedId || !denyReason) {
      message.error("Please enter a reason");
      return;
    }

    try {
      await api.put(`/approve/koi-variety/${selectedId}`, {
        isApproved: false,
        reason: denyReason,
      });
      toast.success("Koi variety denied successfully");
      setDenyModalVisible(false);
      setDenyReason("");
      fetchData();
    } catch (error) {}
  };

  const showDetailModal = (record: KoiVariety) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnsType<KoiVariety> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
      render: (id) => <span className="text-gray-600 font-medium">#{id}</span>,
    },
    {
      title: "Variety Name",
      dataIndex: "varietyName",
      key: "varietyName",
      width: 150,
      render: (name) => (
        <span className="font-semibold text-blue-600">{name}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
      render: (text: string) => (
        <Tooltip title={text} overlayClassName="max-w-md" placement="topLeft">
          <div className="text-gray-700 line-clamp-2 leading-snug">
            {text || "-"}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Farm",
      dataIndex: "farm",
      key: "farm",
      width: 150,
      render: (farm: Farm) => (
        <Tag color="blue" className="m-0">
          {farm?.farmName || "No farm"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: boolean) => (
        <Tag
          color={status ? "green" : "orange"}
          className="px-3 py-1 rounded-full"
        >
          {status ? (
            <span className="flex items-center">
              <CheckCircleOutlined className="mr-1" /> Approved
            </span>
          ) : (
            <span className="flex items-center">
              <ClockCircleOutlined className="mr-1" /> Pending
            </span>
          )}
        </Tag>
      ),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 120,
      align: "center",
      render: (url: string) => (
        <div className="flex justify-center">
          <Image
            src={url || "/placeholder-koi.jpg"}
            alt="Koi Variety"
            width={60}
            height={60}
            className="rounded-md object-cover border border-gray-200 shadow-sm"
            preview={{
              mask: <EyeOutlined className="text-white" />,
              maskClassName: "rounded-md",
            }}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 180,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showDetailModal(record)}
            className="flex items-center"
          >
            View
          </Button>
          {!record.status && (
            <>
              <Popconfirm
                title="Are you sure to approve this variety?"
                onConfirm={() => handleApprove(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  className="flex items-center bg-green-500 hover:bg-green-600"
                >
                  Approve
                </Button>
              </Popconfirm>
              <Button
                danger
                icon={<ClockCircleOutlined />}
                className="flex items-center"
                onClick={() => showDenyModal(record.id)}
              >
                Deny
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="New Koi Varieties Approval">
        <div style={{ padding: 24, maxWidth: "100%", overflowX: "hidden" }}>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={currentPageData}
            pagination={{
              ...pagination,
              onChange: handleTableChange,
              showSizeChanger: false,
            }}
            loading={loading}
            scroll={{ x: true }}
            size="middle"
            bordered
          />

          <Modal
            title="Koi Variety Details"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Close
              </Button>,
            ]}
            width={700}
          >
            {selectedRecord && (
              <Descriptions bordered column={1}>
                <Descriptions.Item label="ID">
                  {selectedRecord.id}
                </Descriptions.Item>
                <Descriptions.Item label="Variety Name">
                  {selectedRecord.varietyName}
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  <div style={{ whiteSpace: "pre-line" }}>
                    {selectedRecord.description}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Farm">
                  <Tag color="blue">
                    {selectedRecord.farm?.farmName || "No farm"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created By">
                  {selectedRecord.createdBy}
                </Descriptions.Item>
                <Descriptions.Item label="Created Time">
                  {new Date(selectedRecord.createdTime).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={selectedRecord.status ? "green" : "red"}>
                    {selectedRecord.status ? "Approved" : "Pending"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Image">
                  <Image
                    src={selectedRecord.imageUrl}
                    alt="Koi Variety"
                    width="100%"
                    style={{ maxWidth: "300px", objectFit: "cover" }}
                  />
                </Descriptions.Item>
              </Descriptions>
            )}
          </Modal>

          <Modal
            title="Enter Deny Reason"
            open={denyModalVisible}
            onCancel={() => {
              setDenyModalVisible(false);
              setDenyReason("");
            }}
            footer={[
              <Button
                key="cancel"
                onClick={() => {
                  setDenyModalVisible(false);
                  setDenyReason("");
                }}
              >
                Cancel
              </Button>,
              <Popconfirm
                key="confirm"
                title="Are you sure to deny this variety?"
                onConfirm={handleDenyConfirm}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger>
                  Confirm Deny
                </Button>
              </Popconfirm>,
            ]}
            style={{ top: "20%" }}
            bodyStyle={{ paddingBottom: "10px" }}
          >
            <Input.TextArea
              rows={4}
              placeholder="Please enter the reason for denial"
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
              maxLength={100}
              showCount
            />
          </Modal>
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
};

export default KoiVarietiesPage;
