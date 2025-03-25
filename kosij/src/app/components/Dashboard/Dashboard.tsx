/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface MetricsData {
  today: string | number;
  comparison: string;
}

interface DashboardProps {
  title: string;
  metricsData: Record<string, MetricsData>;
  selectedTime: string;
  chartData: any;
  chartOptions: any;
}

const Dashboard: React.FC<DashboardProps> = ({
  title,
  metricsData,
  selectedTime,
  chartData,
  chartOptions,
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">{title}</h2>

      <div className="grid grid-cols-3 gap-6">
        {Object.entries(metricsData).map(([metricTitle, data]) => (
          <MetricCard
            key={metricTitle}
            title={metricTitle}
            today={data.today}
            comparison={data.comparison}
            selectedTime={selectedTime}
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
