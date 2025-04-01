"use client";
import { Table, Button, Spin } from "antd";
import { useRouter } from "next/navigation";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import React, { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import api from "@/config/axios.config";
import ProtectedRoute from "@/app/ProtectedRoute";

interface Tour {
  key: string;
  tourName: string;
  standardPrice: number;
  visaFee: number;
  tourStatus: string;
  numberOfTrips: number;
  totalFarmVisit: number;
}

function Page() {
  const [tourData, setTourData] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await api.get("/tours");
        setTourData(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response.data.value.map((tour: any) => ({
            key: tour.id,
            tourName: tour.tourName,
            standardPrice: tour.standardPrice,
            visaFee: tour.visaFee,
            tourStatus: tour.tourStatus,
            totalFarmVisit: tour.totalFarmVisit,
            numberOfTrips: tour.numberOfTrips,
          }))
        );
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const tourColumns: ColumnsType<Tour> = [
    {
      title: "Name",
      dataIndex: "tourName",
      key: "tourName",
      sorter: (a, b) => a.tourName.localeCompare(b.tourName),
    },
    {
      title: "Standard Price",
      dataIndex: "standardPrice",
      key: "standardPrice",
      sorter: (a, b) => a.standardPrice - b.standardPrice,
      render: (amount: number) =>
        new Intl.NumberFormat("vi-VN").format(amount) + " VND",
    },
    {
      title: "Visa Fee",
      dataIndex: "visaFee",
      key: "visaFee",
      sorter: (a, b) => a.visaFee - b.visaFee,
      render: (amount: number) =>
        new Intl.NumberFormat("vi-VN").format(amount) + " VND",
    },
    {
      title: "Tour Status",
      dataIndex: "tourStatus",
      key: "tourStatus",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value, record) => record.tourStatus === value,
    },
    {
      title: "Total Farm Visit",
      dataIndex: "totalFarmVisit",
      key: "totalFarmVisit",
      sorter: (a, b) => a.totalFarmVisit - b.totalFarmVisit,
    },
    {
      title: "Total Trips",
      dataIndex: "numberOfTrips",
      key: "numberOfTrips",
      sorter: (a, b) => a.numberOfTrips - b.numberOfTrips,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => router.push(`/manager/tours/${record.key}`)}
          >
            Detail
          </Button>
          <Button
            type="default"
            onClick={() =>
              router.push(`/manager/trip/register?tourId=${record.key}`)
            }
          >
            Add Trip
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Tour List">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={tourColumns}
            dataSource={tourData}
            pagination={{ pageSize: 5 }}
          />
        )}
      </ManagerLayout>
    </ProtectedRoute>
  );
}

export default Page;
