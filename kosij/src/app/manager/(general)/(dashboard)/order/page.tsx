/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Dashboard from "@/app/components/Dashboard/Dashboard";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import TimeFilter from "@/app/components/TimeFilter/TimeFilter";
import dayjs from "dayjs";
import api from "@/config/axios.config";

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
  const [chartData, setChartData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const getDateRange = (time: string) => {
    const today = dayjs();
    const maxDate = today.format("YYYY-MM-DD");

    if (time === "day") {
      let startDate = today.format("YYYY-MM-DD");
      let endDate = today.subtract(1, "day").format("YYYY-MM-DD");

      startDate = startDate > maxDate ? maxDate : startDate;
      endDate = endDate > maxDate ? maxDate : endDate;

      return { startDate, endDate };
    } else if (time === "month") {
      return {
        startDate: today.startOf("month").format("YYYY-MM-DD"),
        endDate: today
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD"),
      };
    } else {
      return {
        startDate: today.startOf("year").format("YYYY-MM-DD"),
        endDate: today.subtract(1, "year").startOf("year").format("YYYY-MM-DD"),
      };
    }
  };

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDashboardData = async (startDate: string, endDate: string) => {
      try {
        const res = await api.get(
          `/orders/dashboard?startDate=${startDate}&endDate=${endDate}`
        );
        return res.data;
      } catch (error: any) {
        if (error.response?.status === 400) {
          return {
            totalTransactions: 0,
            successfulOrders: 0,
            cancelledOrders: 0,
            totalRevenue: 0,
            commissionEarned: 0,
            customerSatisfaction: 0,
          };
        } else {
          console.error(
            `Lỗi khi lấy dữ liệu từ ${startDate} đến ${endDate}:`,
            error.message
          );
          return null;
        }
      }
    };

    const fetchData = async () => {
      setLoading(true);
      setErrorMessage("");

      const { startDate, endDate } = getDateRange(selectedTime);

      const [currentData, previousData] = await Promise.all([
        fetchDashboardData(startDate, startDate),
        fetchDashboardData(endDate, endDate),
      ]);

      if (!currentData || !previousData) {
        setErrorMessage("Không thể lấy dữ liệu từ server.");
        setLoading(false);
        return;
      }

      const calculateComparison = (current: number, previous: number) => {
        if (previous === 0) return "0%";
        return `${(((current - previous) / previous) * 100).toFixed(2)}%`;
      };

      setMetricsData({
        "Total Transactions": {
          today: currentData.totalTransactions,
          comparison: calculateComparison(
            currentData.totalTransactions,
            previousData.totalTransactions
          ),
        },
        "Successful Orders": {
          today: currentData.successfulOrders,
          comparison: calculateComparison(
            currentData.successfulOrders,
            previousData.successfulOrders
          ),
        },
        "Canceled Orders": {
          today: currentData.cancelledOrders,
          comparison: calculateComparison(
            currentData.cancelledOrders,
            previousData.cancelledOrders
          ),
        },
        "Total Revenue": {
          today: currentData.totalRevenue,
          comparison: calculateComparison(
            currentData.totalRevenue,
            previousData.totalRevenue
          ),
        },
        "Commission Earned": {
          today: currentData.commissionEarned,
          comparison: calculateComparison(
            currentData.commissionEarned,
            previousData.commissionEarned
          ),
        },
        "Customer Satisfaction": {
          today: currentData.customerSatisfaction,
          comparison: calculateComparison(
            currentData.customerSatisfaction,
            previousData.customerSatisfaction
          ),
        },
      });

      setChartData({
        labels:
          selectedTime === "day"
            ? ["Today", "Yesterday"]
            : selectedTime === "month"
            ? ["This Month", "Last Month"]
            : ["This Year", "Last Year"],
        datasets: [
          {
            label: "Total Orders",
            data: [currentData.successfulOrders, previousData.successfulOrders],
            backgroundColor: "#4CAF50",
          },
          {
            label: "Canceled Orders",
            data: [currentData.cancelledOrders, previousData.cancelledOrders],
            backgroundColor: "#FF5722",
          },
        ],
      });

      setLoading(false);
    };

    fetchData();
  }, [selectedTime]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Order and Revenue Overview",
      },
    },
  };

  return (
    <ManagerLayout title="Order">
      <div className="p-6 bg-gray-100 min-h-screen">
        <TimeFilter onChange={handleTimeChange} />
        {loading ? (
          <p>Loading...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <Dashboard
            title="Dashboard Overview"
            metricsData={metricsData}
            selectedTime={selectedTime}
            chartData={chartData}
            chartOptions={chartOptions}
          />
        )}
      </div>
    </ManagerLayout>
  );
}

export default Page;
