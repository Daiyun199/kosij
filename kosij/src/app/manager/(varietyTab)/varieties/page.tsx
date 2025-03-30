/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
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
      width: 10,
    },
    {
      title: "Variety Name",
      dataIndex: "varietyName",
      key: "varietyName",
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
      render: (text: string) => (
        <Tooltip title={text}>
          <div
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: "1.5em",
              maxHeight: "3em",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Farms",
      dataIndex: "farms",
      key: "farms",
      width: 150,
      render: (farms: { farmName: string }[]) => (
        <Tooltip
          title={farms?.map((farm) => farm.farmName).join(", ") || "No farms"}
        >
          <div
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: "1.5em",
              maxHeight: "3em",
            }}
          >
            {farms?.map((farm) => farm.farmName).join(", ") || "No farms"}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: boolean) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Approved" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (url: string) => (
        <Image
          src={url}
          alt="Koi Variety"
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
          preview={false}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" onClick={() => showDetailModal(record)}>
            Detail
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => handleApprove(record.id)}
            disabled={record.status}
          >
            Approve
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleDeny(record.id)}
            disabled={!record.status}
          >
            Deny
          </Button>
        </Space>
      ),
    },
  ];

  return (
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
  );
};

export default KoiVarietiesPage;
