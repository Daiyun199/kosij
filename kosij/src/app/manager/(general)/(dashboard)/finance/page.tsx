/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Dashboard from "@/app/components/Dashboard/Dashboard";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import dayjs from "dayjs";
import { Select, DatePicker } from "antd";
import api from "@/config/axios.config";
import ProtectedRoute from "@/app/ProtectedRoute";

const { Option } = Select;

function Page() {
  const [metricsData, setMetricsData] = useState({
    "Total Revenue From Orders": { today: 0, comparison: "0%" },
    "Total Revenue From Trips": { today: 0, comparison: "0%" },
    "Total Revenue": { today: 0, comparison: "0%" },
    "Total Commission To Farm": { today: 0, comparison: "0%" },
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

  const fetchDashboardData = async (startDate: string, endDate: string) => {
    try {
      const res = await api.get(
        `/manager/finance-dashboard?startDate=${startDate}&endDate=${endDate}`
      );
      return res.data.value || {};
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { startDate, endDate } = getDateRange();
      const { startDate: prevStart, endDate: prevEnd } = getPreviousDateRange();

      const [currentData, previousData] = await Promise.all([
        fetchDashboardData(startDate, endDate),
        fetchDashboardData(prevStart, prevEnd),
      ]);
      console.log(currentData);
      setMetricsData({
        "Total Revenue From Orders": {
          today: currentData?.totalRevenueFromOrders ?? 0,
          comparison: calculateComparison(
            currentData?.totalRevenueFromOrders ?? 0,
            previousData?.totalRevenueFromOrders ?? 0
          ),
        },
        "Total Revenue From Trips": {
          today: currentData?.totalRevenueFromTrips ?? 0,
          comparison: calculateComparison(
            currentData?.totalRevenueFromTrips ?? 0,
            previousData?.totalRevenueFromTrips ?? 0
          ),
        },
        "Total Revenue": {
          today: currentData?.totalRevenue ?? 0,
          comparison: calculateComparison(
            currentData?.totalRevenue ?? 0,
            previousData?.totalRevenue ?? 0
          ),
        },
        "Total Commission To Farm": {
          today: currentData?.totalCommissionToFarm ?? 0,
          comparison: calculateComparison(
            currentData?.totalCommissionToFarm ?? 0,
            previousData?.totalCommissionToFarm ?? 0
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
            label: "Commission To Farm",
            data: [
              currentData?.totalCommissionToFarm ?? 0,
              previousData?.totalCommissionToFarm ?? 0,
            ],
            backgroundColor: "rgba(153, 102, 255, 0.6)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      });

      setLoading(false);
    };

    fetchData();
  }, [selectedTime, selectedValue]);

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Trip Revenue">
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
              title="Trip Revenue Dashboard"
              metricsData={metricsData}
              selectedTime={selectedTime}
              chartData={chartData}
              chartOptions={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: {
                    display: true,
                    text: "Revenue and Commission Overview",
                  },
                },
              }}
            />
          )}
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}

export default Page;
