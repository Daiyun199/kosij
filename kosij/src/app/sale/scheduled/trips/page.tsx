/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Table, Button, Spin } from "antd";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import api from "@/config/axios.config";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";

interface Trip {
  key: string;
  tourName: string;
  departurePoint: string;
  destinationPoint: string;
  tripType: string;
  departureDate: string;
  returnDate: string;
  tripStatus: string;
}

function Page() {
  const [tripData, setTripData] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get("/staff/trips");
        setTripData(
          response.data.value
            .filter((trip: any) => trip.tripType === "Scheduled") // Lọc chỉ lấy tripType = "Scheduled"
            .map((trip: any) => ({
              key: trip.id,
              tourName: trip.tourName,
              departurePoint: trip.departurePoint,
              destinationPoint: trip.destinationPoint,
              tripType: trip.tripType,
              departureDate: trip.departureDate,
              returnDate: trip.returnDate,
              tripStatus: trip.tripStatus,
            }))
        );
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const tripColumns: ColumnsType<Trip> = [
    {
      title: "Tour Name",
      dataIndex: "tourName",
      key: "tourName",
      sorter: (a, b) => a.tourName.localeCompare(b.tourName),
    },
    {
      title: "Departure Point",
      dataIndex: "departurePoint",
      key: "departurePoint",
    },
    {
      title: "Destination Point",
      dataIndex: "destinationPoint",
      key: "destinationPoint",
    },
    {
      title: "Trip Type",
      dataIndex: "tripType",
      key: "tripType",
      filters: [
        { text: "Scheduled", value: "Scheduled" },
        { text: "Customized", value: "Customized" },
      ],
      onFilter: (value, record) => record.tripType === value,
    },
    {
      title: "Departure Date",
      dataIndex: "departureDate",
      key: "departureDate",
    },
    {
      title: "Return Date",
      dataIndex: "returnDate",
      key: "returnDate",
    },
    {
      title: "Status",
      dataIndex: "tripStatus",
      key: "tripStatus",
      filters: [
        { text: "Available", value: "Available" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.tripStatus === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => router.push(`/sale/trip/${record.key}`)}
          >
            Detail
          </Button>
        </div>
      ),
    },
  ];

  return (
    <SaleStaffLayout title="Trip List">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={tripColumns}
          dataSource={tripData}
          pagination={{ pageSize: 5 }}
        />
      )}
    </SaleStaffLayout>
  );
}

export default Page;
