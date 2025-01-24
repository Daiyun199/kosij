"use client";
import CustomButton from "@/app/components/Button/Button";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import DynamicTable from "@/app/components/Table/Table";
import React from "react";

function Page() {
  const tourData = [
    {
      key: "1",
      tourID: "1",
      tourName: "City Tour",
      status: "Active",
      type: "Sightseeing",
      createDate: "2024-01-10",
      amountTrip: 5,
      assigned: "John Doe",
    },
    {
      key: "2",
      tourID: "2",
      tourName: "Mountain Adventure",
      status: "Inactive",
      type: "Adventure",
      createDate: "2024-01-15",
      amountTrip: 3,
      assigned: "Jane Smith",
    },
    {
      key: "33",
      tourID: "2",
      tourName: "Mountain Adventure",
      status: "Inactive",
      type: "Adventure",
      createDate: "2024-01-15",
      amountTrip: 3,
      assigned: "Jane Smith",
    },
    {
      key: "44",
      tourID: "2",
      tourName: "Mountain Adventure",
      status: "Inactive",
      type: "Adventure",
      createDate: "2024-01-15",
      amountTrip: 3,
      assigned: "Jane Smith",
    },
    {
      key: "5",
      tourID: "2",
      tourName: "Mountain Adventure",
      status: "Inactive",
      type: "Adventure",
      createDate: "2024-01-15",
      amountTrip: 3,
      assigned: "Jane Smith",
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
      <CustomButton
        type="default"
        onClick={() => console.log("Add Trip:", record)}
      >
        Add Trip
      </CustomButton>
      <CustomButton
        type="danger"
        onClick={() => console.log("Delete:", record)}
      >
        Delete
      </CustomButton>
    </div>
  );

  const tourColumns = [
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
    {
      title: "Amount Trip",
      dataIndex: "amountTrip",
      key: "amountTrip",
    },
    {
      title: "Assigned",
      dataIndex: "assigned",
      key: "assigned",
    },
  ];

  return (
    <div>
      <ManagerLayout title="Tour List">
        <div>
          <DynamicTable
            columns={tourColumns}
            data={tourData}
            actionColumn={actionColumn}
          />
        </div>
      </ManagerLayout>
    </div>
  );
}

export default Page;
