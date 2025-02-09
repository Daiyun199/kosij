"use client";
import CustomButton from "@/app/components/Button/Button";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import DynamicTable from "@/app/components/Table/Table";
import React from "react";

function Page() {
  const deliveryColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Staff Name",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "Shift",
      dataIndex: "shift",
      key: "shift",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (rate: number) => `${rate.toLocaleString()} VND`, // Định dạng số
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];
  const staffData = [
    {
      key: "1",
      id: "001",
      staffName: "Nguyễn Văn A",
      area: "District 1",
      region: "Ho Chi Minh City",
      shift: "Morning",
      phoneNumber: "0901234567",
      rate: 500000,
      status: "Active",
    },
    {
      key: "2",
      id: "002",
      staffName: "Trần Thị B",
      area: "District 2",
      region: "Ho Chi Minh City",
      shift: "Afternoon",
      phoneNumber: "0912345678",
      rate: 450000,
      status: "Inactive",
    },
    {
      key: "3",
      id: "003",
      staffName: "Lê Văn C",
      area: "Ba Đình",
      region: "Hà Nội",
      shift: "Night",
      phoneNumber: "0923456789",
      rate: 600000,
      status: "Active",
    },
    {
      key: "4",
      id: "004",
      staffName: "Phạm Thị D",
      area: "Cầu Giấy",
      region: "Hà Nội",
      shift: "Morning",
      phoneNumber: "0934567890",
      rate: 550000,
      status: "Active",
    },
  ];

  // eslint-disable-next-line
  const actionColumn = (record: any) => (
    <div style={{ display: "flex", gap: "8px" }}>
      <CustomButton
        type="primary"
        onClick={() => console.log("Detail:", record)}
      >
        Assign
      </CustomButton>
    </div>
  );
  return (
    <ManagerLayout title="Delivery StaffStaff">
      <div>
        <DynamicTable
          columns={deliveryColumns}
          data={staffData}
          actionColumn={actionColumn}
        />
      </div>
    </ManagerLayout>
  );
}

export default Page;
