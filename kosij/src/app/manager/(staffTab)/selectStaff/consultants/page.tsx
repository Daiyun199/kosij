/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
export const dynamic = "force-dynamic";
import React, { Suspense, useEffect, useState } from "react";
import { Table, Button, message, Modal, Input, Popconfirm } from "antd";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import api from "@/config/axios.config";
import { ConsultingStaff } from "@/model/ConsultantStaff";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

function Page() {
  const [staffData, setStaffData] = useState<ConsultingStaff[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredData, setFilteredData] = useState<ConsultingStaff[]>([]);
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
    null
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [customize, setCustomize] = useState<boolean | null>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const customizeParam = params.get("customize");
    setCustomize(customizeParam === "true");
  }, []);
  const [tripId, setTripId] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSearchParams(params);
      setTripId(params.get("tripId"));
    }
  }, []);
  useEffect(() => {
    fetchConsultingStaff();
  }, []);

  const fetchConsultingStaff = async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/active-users/ConsultingStaff");
      const transformedData = response.data.value.map(
        (staff: ConsultingStaff) => ({
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
  const handleAssignStaff = async (staffId: string, note: string) => {
    if (!tripId) {
      toast.error("Trip ID is missing.");
      return;
    }

    try {
      const response = await api.put(`/trip/${tripId}/staff-assigment`, {
        staffId,
        note,
      });

      if (response.status === 200) {
        toast.success(response.data.value || "Staff assigned successfully!");
        if (customize) {
          router.push(`/manager/requests/all`);
        } else {
          router.push(`/manager/tours`);
        }
      } else {
        toast.error(response.data.value || "Failed to assign staff.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.value ||
        "An error occurred while assigning staff.";
      toast.error(errorMessage);
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
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setIsConfirmVisible(false);
  };
  const showAssignModal = (staffId: string) => {
    setSelectedStaffId(staffId);
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
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
      title: "Ongoing Trips",
      dataIndex: "ongoingTrip",
      key: "ongoingTrip",
    },
    {
      title: "Completed Trips",
      dataIndex: "completedTrip",
      key: "completedTrip",
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
      onFilter: (value: any, record: ConsultingStaff) =>
        record.status === String(value),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: ConsultingStaff) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => showAssignModal(record.consultingStaffId)}
          >
            Assign
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ManagerLayout title="Consulting Staff List">
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
            open={isConfirmVisible}
            onConfirm={() => {
              if (selectedStaffId) {
                handleAssignStaff(selectedStaffId, note);
                setIsConfirmVisible(false);
                setIsModalOpen(false);
              } else {
                toast.error("No staff selected.");
              }
            }}
            onCancel={() => setIsConfirmVisible(false)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              loading={loading}
              onClick={() => {
                setIsConfirmVisible(true);
              }}
            >
              Assign
            </Button>
          </Popconfirm>,
        ]}
      >
        <p>Enter a note for staff assignment:</p>
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Modal>
    </ManagerLayout>
  );
}

export default Page;
