/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Dashboard from "@/app/components/Dashboard/Dashboard";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import dayjs from "dayjs";
import { Select, DatePicker } from "antd";
import api from "@/config/axios.config";

const { Option } = Select;

function Page() {
  const [metricsData, setMetricsData] = useState({
    "Total Tour Bookings": { today: 0, comparison: "0%" },
    "Total Revenue": { today: 0, comparison: "0%" },
    "Tour Capacity Utilization": { today: 0, comparison: "0%" },
    "Cancellation Rate": { today: 0, comparison: "0%" },
    "Customer Satisfaction": { today: 0, comparison: "0%" },
    "Refund Rate": { today: 0, comparison: "0%" },
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

  useEffect(() => {
    const fetchDashboardData = async (startDate: string, endDate: string) => {
      try {
        const res = await api.get(
          `https://kosij.azurewebsites.net/api/tours/dashboard?startDate=${startDate}&endDate=${endDate}`
        );
        return res.data || {};
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
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

    const fetchData = async () => {
      setLoading(true);
      const { startDate, endDate } = getDateRange();
      const { startDate: prevStart, endDate: prevEnd } = getPreviousDateRange();

      const [currentData, previousData] = await Promise.all([
        fetchDashboardData(startDate, endDate),
        fetchDashboardData(prevStart, prevEnd),
      ]);

      setMetricsData({
        "Total Tour Bookings": {
          today: currentData?.value.totalTourBookings ?? 0,
          comparison: calculateComparison(
            currentData?.value.totalTourBookings ?? 0,
            previousData?.value.totalTourBookings ?? 0
          ),
        },
        "Total Revenue": {
          today: currentData?.value.totalRevenue ?? 0,
          comparison: calculateComparison(
            currentData?.value.totalRevenue ?? 0,
            previousData?.value.totalRevenue ?? 0
          ),
        },
        "Tour Capacity Utilization": {
          today: currentData?.value.tourCapacityUtilization ?? 0,
          comparison: calculateComparison(
            currentData?.value.tourCapacityUtilization ?? 0,
            previousData?.value.tourCapacityUtilization ?? 0
          ),
        },
        "Cancellation Rate": {
          today: currentData?.value.cancellationRate ?? 0,
          comparison: calculateComparison(
            currentData?.value.cancellationRate ?? 0,
            previousData?.value.cancellationRate ?? 0
          ),
        },
        "Customer Satisfaction": {
          today: currentData?.value.customerSatisfaction ?? 0,
          comparison: calculateComparison(
            currentData?.value.customerSatisfaction ?? 0,
            previousData?.value.customerSatisfaction ?? 0
          ),
        },
        "Refund Rate": {
          today: currentData?.value.refundRate ?? 0,
          comparison: calculateComparison(
            currentData?.value.refundRate ?? 0,
            previousData?.value.refundRate ?? 0
          ),
        },
      });
      setChartData({
        labels: ["Capacity Utilization", "Refund Rate"],
        datasets: [
          {
            label: "Current",
            data: [
              currentData?.value.tourCapacityUtilization ?? 0,
              currentData?.value.refundRate ?? 0,
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            borderWidth: 1,
          },
          {
            label: "Previous",
            data: [
              previousData?.value.tourCapacityUtilization ?? 0,
              previousData?.value.refundRate ?? 0,
            ],
            backgroundColor: [
              "rgba(75, 192, 192, 0.3)",
              "rgba(153, 102, 255, 0.3)",
            ],
            borderWidth: 1,
          },
        ],
      });
      setLoading(false);
    };

    fetchData();
  }, [selectedTime, selectedValue]);

  return (
    <ManagerLayout title="Tour Dashboard">
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
          <Dashboard
            title="Dashboard Overview"
            metricsData={metricsData}
            selectedTime={selectedTime}
            chartData={chartData}
            chartOptions={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Tour Booking and Revenue Overview",
                },
              },
            }}
          />
        )}
      </div>
    </ManagerLayout>
  );
}

export default Page;
