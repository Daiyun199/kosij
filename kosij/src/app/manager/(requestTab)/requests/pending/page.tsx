"use client";
import { Table, Button, Spin } from "antd";
import { useRouter } from "next/navigation";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import React, { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import api from "@/config/axios.config";
import { TripRequest } from "@/model/TripRequest";

function Page() {
  const [tripRequests, setTripRequests] = useState<TripRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTripRequests = async () => {
      try {
        const response = await api.get("/trip-requests?requestStatus=Pending");
        setTripRequests(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response.data.value.map((request: any) => ({
            key: request.id,
            nameContact: request.nameContact,
            requestTime: request.requestTime,
            phoneContact: request.phoneContact,
            emailContact: request.emailContact,
            requestStatus: request.requestStatus,
          }))
        );
      } catch (error) {
        console.error("Error fetching trip requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripRequests();
  }, []);

  const tripRequestColumns: ColumnsType<TripRequest> = [
    {
      title: "Contact Name",
      dataIndex: "nameContact",
      key: "nameContact",
    },
    {
      title: "Request Time",
      dataIndex: "requestTime",
      key: "requestTime",
    },
    {
      title: "Phone Contact",
      dataIndex: "phoneContact",
      key: "phoneContact",
    },
    {
      title: "Email Contact",
      dataIndex: "emailContact",
      key: "emailContact",
    },
    {
      title: "Request Status",
      dataIndex: "requestStatus",
      key: "requestStatus",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Assigned", value: "Assigned" },
        { text: "Modification Requested", value: "ModificationRequested" },
        { text: "Manager Rejected", value: "ManagerRejected" },
        { text: "Approved", value: "Approved" },
        { text: "Processing", value: "Processing" },
        { text: "Customer Confirmed", value: "Confirmed" },
        { text: "Cancelled", value: "Cancelled" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.requestStatus === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() =>
              router.push(`/manager/selectStaff?requestId=${record.key}`)
            }
          >
            Assign
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ManagerLayout title="Trip Requests">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={tripRequestColumns}
          dataSource={tripRequests}
          pagination={{ pageSize: 5 }}
        />
      )}
    </ManagerLayout>
  );
}

export default Page;
