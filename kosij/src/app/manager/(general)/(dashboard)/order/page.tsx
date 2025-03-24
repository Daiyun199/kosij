"use client";
import React, { useState } from "react";
import Dashboard from "@/app/components/Dashboard/Dashboard";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import TimeFilter from "@/app/components/TimeFilter/TimeFilter";

function Page() {
  const titles = [
    "Total Transactions",
    "Successful Orders",
    "Canceled Orders",
    "Total Revenue",
    "Commission Earned",
    "Customer Satisfaction",
  ];

  const metricsData = [
    { today: "1,200", comparison: "+5%" },
    { today: "50,000,000", comparison: "+10%" },
    { today: "25", comparison: "-2%" },
    { today: "420,000", comparison: "-5%" },
    { today: "4.5", comparison: "+0.2" },
    { today: "48h", comparison: "+2%" },
  ];

  const [selectedTime, setSelectedTime] = useState("day");

  const handleTimeChange = (selectedTime: string) => {
    setSelectedTime(selectedTime);
  };

  const getChartData = () => {
    switch (selectedTime) {
      case "day":
        return {
          labels: ["Today", "Yesterday"],
          datasets: [
            {
              label: "Total Orders",
              data: [120, 110],
              backgroundColor: "#4CAF50",
            },
            {
              label: "Canceled Orders",
              data: [5, 3],
              backgroundColor: "#FF5722",
            },
          ],
        };
      case "month":
        return {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              label: "Total Orders",
              data: [1200, 1500, 1400, 1600, 1450, 1700],
              backgroundColor: "#4CAF50",
            },
            {
              label: "Canceled Orders",
              data: [50, 40, 35, 60, 45, 70],
              backgroundColor: "#FF5722",
            },
          ],
        };
      case "year":
        return {
          labels: ["2021", "2022", "2023", "2024"],
          datasets: [
            {
              label: "Total Orders",
              data: [12000, 15000, 14000, 16000],
              backgroundColor: "#4CAF50",
            },
            {
              label: "Canceled Orders",
              data: [500, 400, 350, 600],
              backgroundColor: "#FF5722",
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
        text: "Order and Revenue Overview",
      },
    },
  };

  return (
    <ManagerLayout title="Order">
      <div className="p-6 bg-gray-100 min-h-screen">
        <TimeFilter onChange={handleTimeChange} />
        <Dashboard
          title="Dashboard Overview"
          titles={titles}
          metricsData={metricsData}
          selectedTime={selectedTime}
          chartData={getChartData()}
          chartOptions={chartOptions}
        />
      </div>
    </ManagerLayout>
  );
}

export default Page;
