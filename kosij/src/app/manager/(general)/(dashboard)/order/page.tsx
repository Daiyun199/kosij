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
    "Total Transactions": { today: 0, comparison: "0%" },
    "Successful Orders": { today: 0, comparison: "0%" },
    "Canceled Orders": { today: 0, comparison: "0%" },
    "Total Revenue": { today: 0, comparison: "0%" },
    "Commission Earned": { today: 0, comparison: "0%" },
    "Customer Satisfaction": { today: 0, comparison: "0%" },
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

  useEffect(() => {
    const fetchDashboardData = async (startDate: string, endDate: string) => {
      try {
        const res = await api.get(
          `/orders/dashboard?startDate=${startDate}&endDate=${endDate}`
        );
        return res.data || {};
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
        return {};
      }
    };

    const fetchData = async () => {
      setLoading(true);
      const { startDate, endDate } = getDateRange();
      const currentData = await fetchDashboardData(startDate, endDate);

      setMetricsData({
        "Total Transactions": {
          today: currentData?.value.totalTransactions ?? 0,
          comparison: "0%",
        },
        "Successful Orders": {
          today: currentData?.value.successfulOrders ?? 0,
          comparison: "0%",
        },
        "Canceled Orders": {
          today: currentData?.value.cancelledOrders ?? 0,
          comparison: "0%",
        },
        "Total Revenue": {
          today: currentData?.value.totalRevenue ?? 0,
          comparison: "0%",
        },
        "Commission Earned": {
          today: currentData?.value.commissionEarned ?? 0,
          comparison: "0%",
        },
        "Customer Satisfaction": {
          today: currentData?.value.customerSatisfaction ?? 0,
          comparison: "0%",
        },
      });

      setChartData({
        labels: ["Transactions", "Revenue", "Satisfaction"],
        datasets: [
          {
            label: "Current Period",
            data: [
              currentData?.value.totalTransactions ?? 0,
              currentData?.value.totalRevenue ?? 0,
              currentData?.value.customerSatisfaction ?? 0,
            ],
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
        ],
      });

      setLoading(false);
    };

    fetchData();
  }, [selectedTime, selectedValue]);

  return (
    <ManagerLayout title="Order">
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
                title: { display: true, text: "Order and Revenue Overview" },
              },
            }}
          />
        )}
      </div>
    </ManagerLayout>
  );
}

export default Page;
