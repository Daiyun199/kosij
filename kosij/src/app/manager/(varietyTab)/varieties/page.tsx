/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  EyeOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { EnvironmentOutlined, StarFilled } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Tag,
  Tooltip,
  Modal,
  Descriptions,
  Image,
  Avatar,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import api from "@/config/axios.config";
import { toast } from "react-toastify";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import ProtectedRoute from "@/app/ProtectedRoute";

interface KoiVariety {
  id: number;
  varietyName: string;
  description: string;
  imageUrl: string;
  status: boolean;
  farms: {
    farmName: string;
  }[];
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/koi-varieties");
      setAllData(response.data.value);
      setPagination({
        ...pagination,
        total: response.data.value.length,
      });
      updateCurrentPageData(response.data.value, 1);
    } catch (error) {
      toast.error("Failed to fetch Koi Varieties");
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
      await api.put(`/koi-varieties/${id}/approve`);
      toast.success("Koi variety approved successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to approve Koi variety");
    }
  };

  const handleDeny = async (id: number) => {
    try {
      await api.put(`/koi-varieties/${id}/deny`);
      toast.success("Koi variety denied successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to deny Koi variety");
    }
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
      title: "Farms",
      dataIndex: "farms",
      key: "farms",
      width: 200,
      render: (farms: { farmName: string }[]) => (
        <Tooltip
          title={
            farms?.length
              ? farms.map((farm) => farm.farmName).join(", ")
              : "No farms"
          }
          overlayClassName="max-w-md"
        >
          <div className="flex flex-wrap gap-1">
            {farms?.slice(0, 3).map((farm, index) => (
              <Tag key={index} color="blue" className="m-0">
                {farm.farmName}
              </Tag>
            ))}
            {farms?.length > 3 && (
              <Tag color="cyan">+{farms.length - 3} more</Tag>
            )}
            {!farms?.length && <span className="text-gray-400">No farms</span>}
          </div>
        </Tooltip>
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
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDetailModal(record)}
            className="flex items-center"
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Variety List">
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
                <Descriptions.Item label="Farms">
                  {selectedRecord.farms?.length ? (
                    selectedRecord.farms.map((farm) => {
                      const colors = [
                        "magenta",
                        "red",
                        "volcano",
                        "orange",
                        "gold",
                        "lime",
                        "green",
                        "cyan",
                        "blue",
                        "geekblue",
                        "purple",
                      ];
                      const randomIndex = Math.floor(
                        Math.random() * colors.length
                      );
                      const color = colors[randomIndex];

                      return (
                        <Tag
                          key={farm.farmName}
                          color={color}
                          style={{
                            marginBottom: 4,
                            borderRadius: 4,
                            padding: "0 8px",
                          }}
                        >
                          {farm.farmName}
                        </Tag>
                      );
                    })
                  ) : (
                    <Tag color="default">No farms</Tag>
                  )}
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
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
};

export default KoiVarietiesPage;
