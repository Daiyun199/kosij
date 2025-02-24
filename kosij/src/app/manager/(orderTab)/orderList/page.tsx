"use client";
import CustomButton from "@/app/components/Button/Button";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import DynamicTable from "@/app/components/Table/Table";
import React from "react";

function Page() {
  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Trip Name",
      dataIndex: "tripName",
      key: "tripName",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => `${total.toLocaleString()} VND`, // Hiển thị số có định dạng
    },
    {
      title: "Paid",
      dataIndex: "paid",
      key: "paid",
      render: (paid: number) => `${paid.toLocaleString()} VND`,
    },
    {
      title: "Remaining",
      dataIndex: "remaining",
      key: "remaining",
      render: (remaining: number) => `${remaining.toLocaleString()} VND`,
    },
  ];
  const orderData = [
    {
      key: "ORD-001", // Giá trị giống với orderID
      orderID: "ORD-001",
      tripName: "Explore Halong Bay",
      customer: "John Doe",
      orderDate: "2025-02-01",
      total: 5000000,
      paid: 3000000,
      remaining: 2000000,
      status: "Pending",
    },
    {
      key: "ORD-002", // Giá trị giống với orderID
      orderID: "ORD-002",
      tripName: "Sa Pa Adventure",
      customer: "Jane Smith",
      orderDate: "2025-02-05",
      total: 7000000,
      paid: 7000000,
      remaining: 0,
      status: "Completed",
    },
    {
      key: "ORD-003", // Giá trị giống với orderID
      orderID: "ORD-003",
      tripName: "Hoi An Ancient Town",
      customer: "Michael Brown",
      orderDate: "2025-02-08",
      total: 4500000,
      paid: 0,
      remaining: 4500000,
      status: "Cancelled",
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
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

  return (
    <div>
      <div>
        <ManagerLayout title="Tour List">
          <div>
            <DynamicTable
              columns={orderColumns}
              data={orderData}
              actionColumn={actionColumn}
            />
          </div>
        </ManagerLayout>
      </div>
    </div>
  );
}

export default Page;
