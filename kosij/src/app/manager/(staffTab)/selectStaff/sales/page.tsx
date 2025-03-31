/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
export const dynamic = "force-dynamic";
import React, { Suspense, useEffect, useState } from "react";
import { Table, Button, message, Input, Popconfirm, Modal } from "antd";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import api from "@/config/axios.config";
import { SalesStaff } from "@/model/SalesStaff";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

function Page() {
  const [staffData, setStaffData] = useState<SalesStaff[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredData, setFilteredData] = useState<SalesStaff[]>([]);
  const router = useRouter();
  const [tripId, setTripId] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [tourId, setTourId] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTripId(params.get("tripId"));
    setRequestId(params.get("requestId"));
    setTourId(params.get("tourId"));
  }, []);
  useEffect(() => {
    fetchSalesStaff();
  }, []);

  const fetchSalesStaff = async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/active-users/SalesStaff");
      const transformedData = response.data.value.map((staff: SalesStaff) => ({
        ...staff,
        status: staff.status ? "Active" : "Inactive",
      }));
      setStaffData(transformedData);
      setFilteredData(transformedData);
    } catch (error) {
      message.error("Failed to fetch sales staff");
    } finally {
      setLoading(false);
    }
  };
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setIsConfirmVisible(false);
  };
  const showAssignModal = (staffId: string) => {
    setSelectedStaffId(staffId);
    setIsModalOpen(true);
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
  const handleAssignStaff = async (staffId: string, note: string) => {
    setIsConfirmVisible(false);
    if (!tripId && !requestId) {
      toast.error("Trip ID or Request ID is missing.");
      return;
    }

    const endpoint = tripId
      ? `/trip/${tripId}/staff-assigment`
      : `/trip-request/${requestId}/staff-assigment`;

    try {
      const response = await api.put(endpoint, { staffId, note });

      if (response.status === 200) {
        toast.success(response.data.message || "Staff assigned successfully!");
        router.push(
          tripId
            ? `/manager/trip/${tripId}?tourId=${tourId}`
            : `/manager/requests/pending`
        );
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
      title: "Ongoing Requests",
      dataIndex: "ongoingRequest",
      key: "ongoingRequest",
    },
    {
      title: "Completed Requests",
      dataIndex: "completedRequest",
      key: "completedRequest",
    },
    {
      title: "Assigned Trip",
      dataIndex: "assignedTrip",
      key: "assignedTrip",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
      ],

      onFilter: (value: any, record: SalesStaff) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: SalesStaff) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => showAssignModal(record.salesStaffId)}
          >
            Assign
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ManagerLayout title="Sales Staff List">
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
            onConfirm={async () => {
              if (selectedStaffId) {
                await handleAssignStaff(selectedStaffId, note);
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
          onChange={(e) => {
            if (e.target.value.length <= 150) {
              setNote(e.target.value);
            }
          }}
          maxLength={150}
        />
      </Modal>
    </ManagerLayout>
  );
}

export default Page;
