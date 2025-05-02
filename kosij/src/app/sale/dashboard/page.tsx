/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Dashboard from "@/app/components/Dashboard/Dashboard";
import dayjs from "dayjs";
import { Select, DatePicker, Table, Card, Space, Typography } from "antd";
import type { TableColumnsType } from "antd";
import api from "@/config/axios.config";
import ProtectedRoute from "@/app/ProtectedRoute";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const { Option } = Select;
const { Title } = Typography;

interface Trip {
  id: number;
  tripType: string;
  departureDate: string;
  returnDate: string;
  minGroupSize: number;
  maxGroupSize: number;
  pricingRate: number;
  tripStatus: string;
  tourId: number;
  salesStaffId: string;
  consultingStaffId: string;
  isDeleted: boolean;
}

interface TripRequest {
  id: number;
  numberOfPassengers: number;
  days: number;
  nights: number;
  departureDate: string;
  returnDate: string;
  departurePoint: string;
  affordableBudget: number;
  nameContact: string;
  phoneContact: string;
  emailContact: string;
  note: string;
  modifiedNote: string;
  feedback: string;
  salesStaffId: number;
  salesStaffName: string;
  salesStaffEmail: string;
  salesStaffPhone: string;
  requestStatus: string;
  tripBookingId: number;
  customerAccountId: string;
  customerUserName: string;
  customerFullName: string;
}

interface DetailedData {
  totalScheduledTrips: number;
  totalCustomizedTrips: number;
  totalCompletedTrips: number;
  totalCancelledTrips: number;
  pendingTripRequests: number;
  completedTripRequests: number;
  cancelledTripRequests: number;
  totalTripRequests: number;
  totalRevenue: number;
  scheduledTrips: Trip[];
  customizedTrips: Trip[];
  completedTrips: Trip[];
  cancelledTrips: Trip[];
  pendingRequests: TripRequest[];
  completedRequests: TripRequest[];
  cancelledRequests: TripRequest[];
}

function Page() {
  const [metricsData, setMetricsData] = useState({
    "Total Scheduled Trips": { today: 0, comparison: "0%" },
    "Total Customized Trips": { today: 0, comparison: "0%" },
    "Total Completed Trips": { today: 0, comparison: "0%" },
    "Total Cancelled Trips": { today: 0, comparison: "0%" },
    "Pending Trip Requests": { today: 0, comparison: "0%" },
    "Completed Trip Requests": { today: 0, comparison: "0%" },
    "Cancelled Trip Requests": { today: 0, comparison: "0%" },
    "Total Trip Requests": { today: 0, comparison: "0%" },
    "Total Revenue": { today: 0, comparison: "0%" },
  });

  const [selectedTime, setSelectedTime] = useState("day");
  const [selectedValue, setSelectedValue] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [{ label: "No Data", data: [0] }],
  });
  const [loading, setLoading] = useState(false);
  const [detailedData, setDetailedData] = useState<DetailedData | null>(null);

  const tripColumns: TableColumnsType<Trip> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Type",
      dataIndex: "tripType",
      key: "tripType",
      width: 120,
    },
    {
      title: "Departure Date",
      dataIndex: "departureDate",
      key: "departureDate",
      render: (date) => dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD HH:mm"),
      width: 180,
    },
    {
      title: "Return Date",
      dataIndex: "returnDate",
      key: "returnDate",
      render: (date) => dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD HH:mm"),
      width: 180,
    },
    {
      title: "Group Size",
      key: "groupSize",
      render: (_, record) => `${record.minGroupSize}-${record.maxGroupSize}`,
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "tripStatus",
      key: "tripStatus",
      width: 120,
    },
    {
      title: "Pricing Rate",
      dataIndex: "pricingRate",
      key: "pricingRate",
      render: (rate) => (rate != null ? `${rate * 100}%` : "-"),
      width: 120,
    },
  ];

  const requestColumns: TableColumnsType<TripRequest> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Customer",
      dataIndex: "customerFullName",
      key: "customerFullName",
      width: 150,
    },
    {
      title: "Contact",
      dataIndex: "phoneContact",
      key: "phoneContact",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "emailContact",
      key: "emailContact",
      width: 180,
    },
    {
      title: "Departure Date",
      dataIndex: "departureDate",
      key: "departureDate",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
      width: 150,
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => `${record.days} days / ${record.nights} nights`,
      width: 150,
    },
    {
      title: "Passengers",
      dataIndex: "numberOfPassengers",
      key: "numberOfPassengers",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "requestStatus",
      key: "requestStatus",
      width: 120,
    },
    {
      title: "Sales Staff",
      dataIndex: "salesStaffName",
      key: "salesStaffName",
      width: 150,
    },
  ];

  const handleTimeChange = (value: string) => {
    setSelectedTime(value);
    setSelectedValue(dayjs().format(value === "year" ? "YYYY" : "YYYY-MM-DD"));
  };

  const handleDateChange = (date: any) => {
    if (date) setSelectedValue(date.format("YYYY-MM-DD"));
  };

  const handleMonthChange = (date: any) => {
    if (date) setSelectedValue(date.format("YYYY-MM"));
  };

  const handleYearChange = (date: any) => {
    if (date) setSelectedValue(date.format("YYYY"));
  };

  const getDateRange = () => {
    const today = dayjs(selectedValue);
    if (selectedTime === "day") {
      return {
        startDate: today.format("YYYY-MM-DD"),
        endDate: today.format("YYYY-MM-DD"),
      };
    } else if (selectedTime === "month") {
      return {
        startDate: today.startOf("month").format("YYYY-MM-DD"),
        endDate: today.endOf("month").format("YYYY-MM-DD"),
      };
    } else {
      return {
        startDate: today.startOf("year").format("YYYY-MM-DD"),
        endDate: today.endOf("year").format("YYYY-MM-DD"),
      };
    }
  };

  const getPreviousDateRange = () => {
    const today = dayjs(selectedValue);
    if (selectedTime === "day") {
      const previousDay = today.subtract(1, "day");
      return {
        startDate: previousDay.format("YYYY-MM-DD"),
        endDate: previousDay.format("YYYY-MM-DD"),
      };
    } else if (selectedTime === "month") {
      const previousMonth = today.subtract(1, "month");
      return {
        startDate: previousMonth.startOf("month").format("YYYY-MM-DD"),
        endDate: previousMonth.endOf("month").format("YYYY-MM-DD"),
      };
    } else {
      const previousYear = today.subtract(1, "year");
      return {
        startDate: previousYear.startOf("year").format("YYYY-MM-DD"),
        endDate: previousYear.endOf("year").format("YYYY-MM-DD"),
      };
    }
  };

  const fetchDashboardData = async (startDate: string, endDate: string) => {
    try {
      const res = await api.get(
        `/trips/dashboard/current-sales?startDate=${startDate}&endDate=${endDate}`
      );
      return res.data.value || {};
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
      return {};
    }
  };

  const fetchDetailedData = async (startDate: string, endDate: string) => {
    try {
      const res = await api.get(
        `/trips/dashboard/details/current-sales?startDate=${startDate}&endDate=${endDate}`
      );
      console.log("Detailed Data from API:", res.data);
      return res.data.value || {};
    } catch (error: any) {
      console.error("Error fetching detailed data:", error.message);
      return {};
    }
  };

  const calculateComparison = (current: number, previous: number) => {
    if (previous === 0) {
      return current === 0 ? "0%" : "+100%";
    }
    if (current === 0) {
      return "-100%";
    }
    return `${(((current - previous) / previous) * 100).toFixed(2)}%`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { startDate, endDate } = getDateRange();
      const { startDate: prevStart, endDate: prevEnd } = getPreviousDateRange();

      const [currentData, previousData, currentDetailedData] =
        await Promise.all([
          fetchDashboardData(startDate, endDate),
          fetchDashboardData(prevStart, prevEnd),
          fetchDetailedData(startDate, endDate),
        ]);

      setMetricsData({
        "Total Scheduled Trips": {
          today: currentData?.totalScheduledTrips ?? 0,
          comparison: calculateComparison(
            currentData?.totalScheduledTrips ?? 0,
            previousData?.totalScheduledTrips ?? 0
          ),
        },
        "Total Customized Trips": {
          today: currentData?.totalCustomizedTrips ?? 0,
          comparison: calculateComparison(
            currentData?.totalCustomizedTrips ?? 0,
            previousData?.totalCustomizedTrips ?? 0
          ),
        },
        "Total Completed Trips": {
          today: currentData?.totalCompletedTrips ?? 0,
          comparison: calculateComparison(
            currentData?.totalCompletedTrips ?? 0,
            previousData?.totalCompletedTrips ?? 0
          ),
        },
        "Total Cancelled Trips": {
          today: currentData?.totalCancelledTrips ?? 0,
          comparison: calculateComparison(
            currentData?.totalCancelledTrips ?? 0,
            previousData?.totalCancelledTrips ?? 0
          ),
        },
        "Pending Trip Requests": {
          today: currentData?.pendingTripRequests ?? 0,
          comparison: calculateComparison(
            currentData?.pendingTripRequests ?? 0,
            previousData?.pendingTripRequests ?? 0
          ),
        },
        "Completed Trip Requests": {
          today: currentData?.completedTripRequests ?? 0,
          comparison: calculateComparison(
            currentData?.completedTripRequests ?? 0,
            previousData?.completedTripRequests ?? 0
          ),
        },
        "Cancelled Trip Requests": {
          today: currentData?.cancelledTripRequests ?? 0,
          comparison: calculateComparison(
            currentData?.cancelledTripRequests ?? 0,
            previousData?.cancelledTripRequests ?? 0
          ),
        },
        "Total Trip Requests": {
          today: currentData?.totalTripRequests ?? 0,
          comparison: calculateComparison(
            currentData?.totalTripRequests ?? 0,
            previousData?.totalTripRequests ?? 0
          ),
        },
        "Total Revenue": {
          today: currentData?.totalRevenue ?? 0,
          comparison: calculateComparison(
            currentData?.totalRevenue ?? 0,
            previousData?.totalRevenue ?? 0
          ),
        },
      });

      setChartData({
        labels: ["Current Period", "Previous Period"],
        datasets: [
          {
            label: "Total Revenue",
            data: [
              currentData?.totalRevenue ?? 0,
              previousData?.totalRevenue ?? 0,
            ],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Completed Trips",
            data: [
              currentData?.totalCompletedTrips ?? 0,
              previousData?.totalCompletedTrips ?? 0,
            ],
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      });

      setDetailedData(currentDetailedData);
      setLoading(false);
    };

    fetchData();
  }, [selectedTime, selectedValue]);

  return (
    <ProtectedRoute allowedRoles={["salesstaff"]}>
      <SaleStaffLayout title="Trips Dashboard">
        <div className="p-6 bg-gray-100 min-h-screen">
          <div className="flex items-center space-x-4 mb-4">
            <Select
              value={selectedTime}
              onChange={handleTimeChange}
              style={{ width: 120 }}
            >
              <Option value="day">Ngày</Option>
              <Option value="month">Tháng</Option>
              <Option value="year">Năm</Option>
            </Select>

            {selectedTime === "day" && (
              <DatePicker
                value={dayjs(selectedValue)}
                onChange={handleDateChange}
              />
            )}
            {selectedTime === "month" && (
              <DatePicker
                picker="month"
                value={dayjs(selectedValue)}
                onChange={handleMonthChange}
              />
            )}
            {selectedTime === "year" && (
              <DatePicker
                picker="year"
                value={dayjs(selectedValue)}
                onChange={handleYearChange}
              />
            )}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Dashboard
                title="Trips Overview"
                metricsData={metricsData}
                selectedTime={selectedTime}
                chartData={chartData}
                chartOptions={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: {
                      display: true,
                      text: "Trips and Revenue Overview",
                    },
                  },
                }}
              />

              <div className="mt-8">
                <Title level={3}>Trip Details</Title>

                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <Card title="Scheduled Trips" bordered={false}>
                    <Table
                      columns={tripColumns}
                      dataSource={detailedData?.scheduledTrips || []}
                      rowKey="id"
                      pagination={{ pageSize: 5 }}
                      scroll={{ x: true }}
                      loading={!detailedData}
                    />
                  </Card>

                  <Card title="Customized Trips" bordered={false}>
                    <Table
                      columns={tripColumns}
                      dataSource={detailedData?.customizedTrips || []}
                      rowKey="id"
                      pagination={{ pageSize: 5 }}
                      scroll={{ x: true }}
                      loading={!detailedData}
                    />
                  </Card>

                  <Card title="Completed Trips" bordered={false}>
                    <Table
                      columns={tripColumns}
                      dataSource={detailedData?.completedTrips || []}
                      rowKey="id"
                      pagination={{ pageSize: 5 }}
                      scroll={{ x: true }}
                      loading={!detailedData}
                    />
                  </Card>

                  <Card title="Cancelled Trips" bordered={false}>
                    <Table
                      columns={tripColumns}
                      dataSource={detailedData?.cancelledTrips || []}
                      rowKey="id"
                      pagination={{ pageSize: 5 }}
                      scroll={{ x: true }}
                      loading={!detailedData}
                    />
                  </Card>

                  <Card title="Pending Requests" bordered={false}>
                    <Table
                      columns={requestColumns}
                      dataSource={detailedData?.pendingRequests || []}
                      rowKey="id"
                      pagination={{ pageSize: 5 }}
                      scroll={{ x: true }}
                      loading={!detailedData}
                    />
                  </Card>

                  <Card title="Completed Requests" bordered={false}>
                    <Table
                      columns={requestColumns}
                      dataSource={detailedData?.completedRequests || []}
                      rowKey="id"
                      pagination={{ pageSize: 5 }}
                      scroll={{ x: true }}
                      loading={!detailedData}
                    />
                  </Card>

                  <Card title="Cancelled Requests" bordered={false}>
                    <Table
                      columns={requestColumns}
                      dataSource={detailedData?.cancelledRequests || []}
                      rowKey="id"
                      pagination={{ pageSize: 5 }}
                      scroll={{ x: true }}
                      loading={!detailedData}
                    />
                  </Card>
                </Space>
              </div>
            </>
          )}
        </div>
      </SaleStaffLayout>
    </ProtectedRoute>
  );
}

export default Page;
