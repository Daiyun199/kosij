/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Typography,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import api from "@/config/axios.config";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { toast } from "react-toastify";
import SearchBar from "@/app/components/SearchBar/SearchBar";

interface ConfigTemplate {
  id: number;
  tagName: string;
  description: string;
  rangeStart: number;
  rangeEnd: number;
  rate: number;
}

interface NewTemplateForm {
  tagName: string;
  description: string;
  rangeStart: number;
  rangeEnd: number;
  rate: number;
}

const ConfigTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<ConfigTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm<NewTemplateForm>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get("/config-templates");
      const sortedData = response.data.value.sort(
        (a: ConfigTemplate, b: ConfigTemplate) => {
          const tagCompare = a.tagName.localeCompare(b.tagName);
          if (tagCompare !== 0) return tagCompare;

          return b.rangeStart - a.rangeStart;
        }
      );
      setTemplates(sortedData);
    } catch (err) {
      setError("Failed to fetch config templates");
      console.error("Error fetching config templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      console.log("s");
      const values = await form.validateFields();
      setShowConfirm(true);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setShowConfirm(false);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setConfirmLoading(true);
    try {
      const values = form.getFieldsValue();
      await api.post("/config-templates", values);
      toast.success("Template added successfully");
      setIsModalOpen(false);

      form.resetFields();
      fetchTemplates();
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          "Failed to add template";
        toast.error(errorMessage);

        if (error.response.data.errors) {
          console.error("Validation errors:", error.response.data.errors);
        }
      } else if (error.request) {
        toast.error("No response received from server");
        console.error("No response:", error.request);
      } else {
        toast.error("Error setting up request");
        console.error("Request error:", error.message);
      }
      setIsModalOpen(false);
      form.resetFields();
    } finally {
      setConfirmLoading(false);
    }
  };

  const columns: ColumnsType<ConfigTemplate> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tag",
      dataIndex: "tagName",
      key: "tagName",
      render: (tagName) => <Tag color={getTagColor(tagName)}>{tagName}</Tag>,
      filters: [
        { text: "TourCancellationPolicy", value: "TourCancellationPolicy" },
        { text: "TourPrice", value: "TourPrice" },
        { text: "TourDepositRate", value: "TourDepositRate" },
        { text: "TourLastPayment", value: "TourLastPayment" },
        { text: "TourGroupDiscount", value: "TourGroupDiscount" },
        { text: "OrderCommission", value: "OrderCommission" },
        { text: "OrderDeposit", value: "OrderDeposit" },
        { text: "OrderCancellationPolicy", value: "OrderCancellationPolicy" },
      ],
      onFilter: (value, record) => record.tagName === value,
      sorter: (a, b) => a.tagName.localeCompare(b.tagName),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Range",
      key: "range",
      render: (_, record) => (
        <span>
          {record.rangeStart === record.rangeEnd
            ? record.rangeStart === 0
              ? "N/A"
              : record.rangeStart
            : `${record.rangeStart} - ${record.rangeEnd}`}
        </span>
      ),
      sorter: (a, b) => b.rangeStart - a.rangeStart,
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (rate) => `${(rate * 100).toFixed(0)}%`,
      sorter: (a, b) => a.rate - b.rate,
    },
  ];

  const getTagColor = (tagName: string): string => {
    const colors: Record<string, string> = {
      TourCancellationPolicy: "red",
      TourPrice: "blue",
      TourDepositRate: "green",
      TourLastPayment: "orange",
      TourGroupDiscount: "purple",
      OrderCommission: "cyan",
      OrderDeposit: "gold",
      OrderCancellationPolicy: "volcano",
    };
    return colors[tagName] || "default";
  };

  return (
    <ManagerLayout title="Templates">
      <div style={{ padding: "24px" }}>
        <Card>
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
              Configuration Templates
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

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 16,
            }}
          >
            <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
              Add Template
            </Button>
          </div>

          {error ? (
            <Typography.Text type="danger">{error}</Typography.Text>
          ) : (
            <Table
              columns={columns}
              dataSource={templates.filter((template) => {
                const keyword = searchValue.toLowerCase();
                return (
                  template.description.toLowerCase().includes(keyword) ||
                  template.tagName.toLowerCase().includes(keyword)
                );
              })}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          )}
        </Card>

        <Modal
          title="Add New Template"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
            <Popconfirm
              key="submit"
              title="Are you sure to add this template?"
              open={showConfirm}
              onConfirm={handleConfirm}
              onCancel={() => setShowConfirm(false)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                loading={confirmLoading}
                onClick={() => {
                  form
                    .validateFields()
                    .then(() => {
                      setShowConfirm(true);
                    })
                    .catch((info) => {
                      console.log("Validate Failed:", info);
                    });
                }}
              >
                Submit
              </Button>
            </Popconfirm>,
          ]}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="tagName"
              label="Tag Name"
              rules={[
                { required: true, message: "Please input the tag name!" },
              ]}
            >
              <Input placeholder="e.g. TourCancellationPolicy" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="rangeStart"
              label="Range Start"
              rules={[{ required: true, message: "Please input range start!" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item
              name="rangeEnd"
              label="Range End"
              rules={[{ required: true, message: "Please input range end!" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item
              name="rate"
              label="Rate"
              rules={[{ required: true, message: "Please input the rate!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                max={1}
                step={0.01}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ManagerLayout>
  );
};

export default ConfigTemplatesPage;
