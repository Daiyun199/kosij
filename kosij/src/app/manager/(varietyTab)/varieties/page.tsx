/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Space, message, Tag } from "antd";
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

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnsType<KoiVariety> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Variety Name",
      dataIndex: "varietyName",
      key: "varietyName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
      render: (url: string) => (
        <img
          src={url}
          alt="Koi Variety"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleApprove(record.id)}
            disabled={record.status}
          >
            Approve
          </Button>
          <Button
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
      <div style={{ padding: 24 }}>
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
          scroll={{ x: 1000 }}
        />
      </div>
    </ManagerLayout>
  );
};

export default KoiVarietiesPage;
