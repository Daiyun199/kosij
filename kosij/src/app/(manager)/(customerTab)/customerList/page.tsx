"use client";
import CustomButton from "@/app/components/Button/Button";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import DynamicTable from "@/app/components/Table/Table";
import { Customer } from "@/app/types/customer";

import React from "react";

function page() {
  const actionColumn = (record: Customer) => (
    <div style={{ display: "flex", gap: "8px" }}>
      <CustomButton
        type="primary"
        onClick={() => console.log("Detail:", record)}
      >
        Detail
      </CustomButton>
      <CustomButton type="danger" onClick={() => console.log(record.key)}>
        Delete
      </CustomButton>
    </div>
  );
  const customerData: Customer[] = [
    {
      key: "1",
      customerName: "John Doe",
      phoneNumber: "123-456-7890",
      email: "johndoe@example.com",
      country: "USA",
      status: "Active",
    },
    {
      key: "2",
      customerName: "Jane Smith",
      phoneNumber: "987-654-3210",
      email: "janesmith@example.com",
      country: "Canada",
      status: "Inactive",
    },
  ];
  const customerColumns = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <div>
      <ManagerLayout title="Customer List">
        <div>
          <DynamicTable
            columns={customerColumns}
            data={customerData}
            actionColumn={actionColumn}
          />
        </div>
      </ManagerLayout>
    </div>
  );
}

export default page;
