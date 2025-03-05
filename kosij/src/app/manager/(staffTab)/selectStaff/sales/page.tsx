/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
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
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
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
  const handleAssignStaff = async (staffId: string) => {
    if (!tripId) {
      toast.error("Trip ID is missing.");
      return;
    }

    try {
      const response = await api.put(`/trip/${tripId}/staff-assigment`, {
        staffId,
      });

      if (response.status === 200) {
        toast.success(response.data.message || "Staff assigned successfully!");
        router.push(`/manager/trip/${tripId}`);
      } else {
        toast.error(response.data.value || "Failed to assign staff.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFilter: (value: any, record: SalesStaff) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: SalesStaff) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => handleAssignStaff(record.salesStaffId)}
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
    </ManagerLayout>
  );
}

export default Page;
