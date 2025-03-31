/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, message, DatePicker } from "antd";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import axios from "axios";
import dayjs from "dayjs";
import api from "@/config/axios.config";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import { DeliveryStaff } from "@/model/DeliveryStaff";
import ProtectedRoute from "@/app/ProtectedRoute";

function Page() {
  const [staffData, setStaffData] = useState<DeliveryStaff[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredData, setFilteredData] = useState<DeliveryStaff[]>([]);

  useEffect(() => {
    fetchDeliveryStaff();
  }, []);

  const fetchDeliveryStaff = async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/users/DeliveryStaff");
      const transformedData = response.data.value.map(
        (staff: DeliveryStaff) => ({
          ...staff,
          status: staff.status ? "Active" : "Inactive",
        })
      );
      setStaffData(transformedData);
      setFilteredData(transformedData);
    } catch (error) {
      message.error("Failed to fetch delivery staff");
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
      render: (status: boolean) => (status ? "Active" : "Inactive"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFilter: (value: any, record: DeliveryStaff) =>
        (record.status ? "Active" : "Inactive") === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: DeliveryStaff) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button type="primary" onClick={() => console.log("Detail:", record)}>
            Detail
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => console.log("Delete:", record.accountId)}
          >
            Delete
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
      </ManagerLayout>
    </ProtectedRoute>
  );
}

export default Page;
