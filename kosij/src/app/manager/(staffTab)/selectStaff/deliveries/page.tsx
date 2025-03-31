/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
export const dynamic = "force-dynamic";
import React, { Suspense, useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input, Popconfirm } from "antd";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import api from "@/config/axios.config";

import SearchBar from "@/app/components/SearchBar/SearchBar";

import { toast } from "react-toastify";
import { DeliveryStaff } from "@/model/DeliveryStaff";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/app/ProtectedRoute";

function Page() {
  const [staffData, setStaffData] = useState<DeliveryStaff[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredData, setFilteredData] = useState<DeliveryStaff[]>([]);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("trackId");
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    fetchDeliveryStaff();
  }, []);

  const fetchDeliveryStaff = async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/active-users/DeliveryStaff");
      const transformedData = response.data.value.map(
        (staff: DeliveryStaff) => ({
          ...staff,
          status: staff.status ? "Active" : "Inactive",
        })
      );
      setStaffData(transformedData);
      setFilteredData(transformedData);
    } catch (error) {
      message.error("Failed to fetch consulting staff");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    const filtered = staffData.filter(
      (staff) =>
        staff.fullName.toLowerCase().includes(value.toLowerCase()) ||
        staff.email.toLowerCase().includes(value.toLowerCase()) ||
        staff.area.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };
  const handleAssignClick = (staffId: number) => {
    setSelectedStaffId(staffId);
    setIsModalOpen(true);
  };
  const handleModalOk = async () => {
    if (!selectedStaffId || !orderId) {
      message.error("Missing required information.");
      return;
    }

    try {
      const response = await api.put(`/order/${orderId}/staff-assigment`, {
        staffId: selectedStaffId,
        note: note,
      });

      if (response.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.success("Staff assigned successfully!");
      }

      setIsModalOpen(false);
      setNote("");
      router.push(`/manager/tours`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.value || "Failed to assign staff.";
      toast.error(errorMessage);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setNote("");
  };
  const staffColumns = [
    {
      title: "Account ID",
      dataIndex: "accountId",
      key: "accountId",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Ongoing Orders",
      dataIndex: "ongoingOrder",
      key: "ongoingOrder",
    },
    {
      title: "Completed Orders",
      dataIndex: "completedOrder",
      key: "completedOrder",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFilter: (value: any, record: DeliveryStaff) =>
        record.status === String(value),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: DeliveryStaff) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => handleAssignClick(record.deliveryStaffId)}
          >
            Assign
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Delivery Staff List">
        <div style={{ marginBottom: "8px" }}>
          <SearchBar value={searchValue} onChange={handleSearch} />
        </div>
        <Table
          columns={staffColumns}
          dataSource={filteredData}
          rowKey="accountId"
          loading={loading}
          bordered
          pagination={{ pageSize: 5 }}
        />
        <Modal
          title="Assign Staff"
          open={isModalOpen}
          onCancel={handleModalCancel}
          footer={[
            <Button key="cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>,
            <Popconfirm
              key="assign"
              title="Are you sure you want to assign this staff?"
              onConfirm={handleModalOk}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" loading={loading}>
                Assign
              </Button>
            </Popconfirm>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Note">
              <Input.TextArea
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      </ManagerLayout>
    </ProtectedRoute>
  );
}

export default Page;
