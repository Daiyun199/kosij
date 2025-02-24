/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Table, Button, message, DatePicker } from "antd";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import api from "@/config/axios.config";
import { Customer } from "@/model/Customer";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

function Page() {
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/manager/users/Customer");
      setCustomerData(response.data.value);
    } catch (error) {
      message.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = customerData.filter((customer) => {
    const recordDate = dayjs(customer.dateOfJoining);
    const isInDateRange =
      !dateRange[0] ||
      !dateRange[1] ||
      recordDate.isBetween(dateRange[0], dateRange[1], null, "[]");

    const isInSearch =
      customer.fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchValue.toLowerCase()) ||
      customer.phoneNumber.includes(searchValue);

    return isInDateRange && isInSearch;
  });

  const customerColumns = [
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
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
      filters: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
        { text: "Unknown", value: "Unknown" },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFilter: (value: any, record: Customer) => record.sex === value,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Date of Joining",
      dataIndex: "dateOfJoining",
      key: "dateOfJoining",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Customer) => (
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
    <ManagerLayout title="Customer List">
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <SearchBar
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <DatePicker.RangePicker
          onChange={(dates) =>
            setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])
          }
        />
      </div>

      <Table
        columns={customerColumns}
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
