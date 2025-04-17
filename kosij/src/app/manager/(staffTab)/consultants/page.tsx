/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import api from "@/config/axios.config";
import { ConsultingStaff } from "@/model/ConsultantStaff";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import ProtectedRoute from "@/app/ProtectedRoute";
import { useRouter } from "next/navigation";

function Page() {
  const [staffData, setStaffData] = useState<ConsultingStaff[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredData, setFilteredData] = useState<ConsultingStaff[]>([]);
  useEffect(() => {
    fetchConsultingStaff();
  }, []);
  const router = useRouter();

  const fetchConsultingStaff = async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/users/ConsultingStaff");
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
            onClick={() =>
              router.push(`/manager/consultants/${record.accountId}`)
            }
          >
            Detail
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
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
      </ManagerLayout>
    </ProtectedRoute>
  );
}

export default Page;
