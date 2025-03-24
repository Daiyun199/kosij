"use client";
import React, { useState } from "react";
import Dashboard from "@/app/components/Dashboard/Dashboard";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import TimeFilter from "@/app/components/TimeFilter/TimeFilter";

function Page() {
  const titles = [
    "Tour Bookings",
    "Total Revenue",
    "Tour Capacity Utilization",
    "Cancellation Rate",
    "Customer Satisfaction",
    "Refund Rate",
  ];

  const metricsData = [
    { today: "1,200", comparison: "+5%" },
    { today: "50,000,000", comparison: "+10%" },
    { today: "25%", comparison: "-2%" },
    { today: "5%", comparison: "-5%" },
    { today: "4.5", comparison: "+0.2" },
    { today: "2%", comparison: "+2%" },
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
              label: "Tour Bookings",
              data: [120, 110],
              backgroundColor: "#4CAF50",
            },
            {
              label: "Cancellation Rate",
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
              label: "Tour Bookings",
              data: [1200, 1500, 1400, 1600, 1450, 1700],
              backgroundColor: "#4CAF50",
            },
            {
              label: "Cancellation Rate",
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
              label: "Tour Bookings",
              data: [12000, 15000, 14000, 16000],
              backgroundColor: "#4CAF50",
            },
            {
              label: "Cancellation Rate",
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
        text: "Tour Booking and Revenue Overview",
      },
    },
  };

  return (
    <ManagerLayout title="Tour">
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
