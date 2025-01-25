"use client";
import React, { useState } from "react";
import Dashboard from "@/app/components/Dashboard/Dashboard";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import TimeFilter from "@/app/components/TimeFilter/TimeFilter";

function Page() {
  const metrics = [
    { title: "Revenue", today: "120", comparison: "+15%" },
    { title: "Expense", today: "50,000,000", comparison: "+10%" },
    { title: "Net Profit", today: "5", comparison: "-2%" },
    { title: "Net Cash Flow", today: "420,000", comparison: "-5%" },
    { title: "Net Profit Margin", today: "4.5", comparison: "+0.2" },
    { title: "Revenue Growth", today: "48h", comparison: "+2%" },
  ];

  const [selectedTime, setSelectedTime] = useState("day");

  const handleTimeChange = (selectedTime: string) => {
    setSelectedTime(selectedTime);
  };

  const getChartData = () => {
    switch (selectedTime) {
      case "day":
        return {
          labels: ["Today", "Yesterday"], // Ví dụ so với ngày hôm nay và hôm qua
          datasets: [
            {
              label: "Revenue",
              data: [30, 20],
              backgroundColor: "#4CAF50",
            },
            {
              label: "Expense",
              data: [20, 15],
              backgroundColor: "#2196F3",
            },
          ],
        };
      case "month":
        return {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              label: "Revenue",
              data: [30, 50, 40, 60, 45, 70],
              backgroundColor: "#4CAF50",
            },
            {
              label: "Expense",
              data: [20, 40, 35, 50, 40, 60],
              backgroundColor: "#2196F3",
            },
          ],
        };
      case "year":
        return {
          labels: ["2021", "2022", "2023", "2024"],
          datasets: [
            {
              label: "Revenue",
              data: [300, 500, 450, 600],
              backgroundColor: "#4CAF50",
            },
            {
              label: "Expense",
              data: [200, 400, 350, 500],
              backgroundColor: "#2196F3",
            },
          ],
        };
      default:
        return {};
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Revenue and Expense Overview",
      },
    },
  };

  return (
    <div>
      <ManagerLayout title="Finance">
        <div className="p-6 bg-gray-100 min-h-screen">
          <TimeFilter onChange={handleTimeChange} />
          <Dashboard
            metrics={metrics}
            selectedTime={selectedTime} // Pass selectedTime here
            chartData={getChartData()}
            chartOptions={chartOptions}
          />
        </div>
      </ManagerLayout>
    </div>
  );
}

export default Page;
