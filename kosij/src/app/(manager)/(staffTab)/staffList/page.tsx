"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import DynamicTable from "@/app/components/Table/Table";
import React from "react";

function Page() {
  const staffData = [
    {
      key: "1",
      staffId: "S001",
      name: "John Doe",
      phone: "123-456-7890",
      email: "johndoe@example.com",
      role: "Manager",
      status: "Active",
      dateOfJoining: "2024-01-10",
    },
    {
      key: "2",
      staffId: "S002",
      name: "Jane Smith",
      phone: "987-654-3210",
      email: "janesmith@example.com",
      role: "Assistant",
      status: "Inactive",
      dateOfJoining: "2024-01-15",
    },
    {
      key: "3",
      staffId: "S003",
      name: "Alice Brown",
      phone: "555-123-4567",
      email: "alicebrown@example.com",
      role: "Manager",
      status: "Active",
      dateOfJoining: "2024-02-01",
    },
    {
      key: "4",
      staffId: "S004",
      name: "Bob Green",
      phone: "333-555-7777",
      email: "bobgreen@example.com",
      role: "Assistant",
      status: "Inactive",
      dateOfJoining: "2024-01-20",
    },
    {
      key: "5",
      staffId: "S005",
      name: "Charlie White",
      phone: "222-444-6666",
      email: "charliewhite@example.com",
      role: "Manager",
      status: "Active",
      dateOfJoining: "2024-03-10",
    },
  ];

  const staffColumns = [
    {
      title: "Staff ID",
      dataIndex: "staffId",
      key: "staffId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Date of Joining",
      dataIndex: "dateOfJoining",
      key: "dateOfJoining",
    },
  ];

  return (
    <div>
      <ManagerLayout title="Staff List">
        <div>
          <DynamicTable columns={staffColumns} data={staffData} />
        </div>
      </ManagerLayout>
    </div>
  );
}

export default Page;
