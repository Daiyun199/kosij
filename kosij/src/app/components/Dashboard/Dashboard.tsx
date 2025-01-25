"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import MetricCard from "../MetricCard/MetricCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  metrics: Array<{
    title: string;
    today: string | number;
    comparison: string;
  }>;
  selectedTime: string; // Receive selectedTime here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartOptions: any;
}

const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  selectedTime, // Get selectedTime from the parent
  chartData,
  chartOptions,
}) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            today={metric.today}
            comparison={metric.comparison}
            selectedTime={selectedTime} // Pass selectedTime here
          />
        ))}
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
