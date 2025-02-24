"use client";
import CustomButton from "@/app/components/Button/Button";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import DynamicTable from "@/app/components/Table/Table";
import React from "react";

function Page() {
  const tourPendingData = [
    {
      key: "1",
      tourID: "1",
      tourName: "City Tour",
      customerName: "Alice Johnson",
      staffName: "John Doe",
      status: "Pending",
      type: "Sightseeing",
      createDate: "2024-01-10",
    },
    {
      key: "2",
      tourID: "2",
      tourName: "Mountain Adventure",
      customerName: "Bob Smith",
      staffName: "Jane Smith",
      status: "Pending",
      type: "Adventure",
      createDate: "2024-01-15",
    },
    {
      key: "3",
      tourID: "3",
      tourName: "Beach Escape",
      customerName: "Charlie Brown",
      staffName: "Tommy Lee",
      status: "Pending",
      type: "Relaxation",
      createDate: "2024-02-01",
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actionColumn = (record: any) => (
    <div style={{ display: "flex", gap: "8px" }}>
      <CustomButton
        type="primary"
        onClick={() => console.log("Detail:", record)}
      >
        Detail
      </CustomButton>
    </div>
  );

  const tourPendingColumns = [
    {
      title: "Tour ID",
      dataIndex: "tourID",
      key: "tourID",
    },
    {
      title: "Tour Name",
      dataIndex: "tourName",
      key: "tourName",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Staff Name",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Create Date",
      dataIndex: "createDate",
      key: "createDate",
    },
  ];

  return (
    <div>
      <ManagerLayout title="Tour Pending List">
        <div>
          <DynamicTable
            columns={tourPendingColumns}
            data={tourPendingData}
            actionColumn={actionColumn}
          />
        </div>
      </ManagerLayout>
    </div>
  );
}

export default Page;
