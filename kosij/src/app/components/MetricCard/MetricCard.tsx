import React from "react";
import { Card, CardContent, CardHeader } from "../Card/Card";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface MetricCardProps {
  title: string;
  today: string | number;
  comparison: string;
  selectedTime: string;
  chart?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  today,
  comparison,
  selectedTime,
  chart,
}) => {
  let comparisonText = "";
  if (selectedTime === "day") {
    comparisonText = `So với ngày hôm qua: ${comparison}`;
  } else if (selectedTime === "month") {
    comparisonText = `So với tháng trước: ${comparison}`;
  } else if (selectedTime === "year") {
    comparisonText = `So với năm trước: ${comparison}`;
  }

  return (
    <Card className="flex flex-col items-center justify-between p-6 w-full bg-gradient-to-r from-white to-gray-50 shadow-md rounded-2xl hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="text-lg font-semibold text-gray-700 text-center">
        {title}
      </CardHeader>
      <CardContent className="text-center space-y-4 w-full">
        <div className="flex items-center justify-center space-x-4">
          <p className="text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat("vi-VN").format(Number(today))}
          </p>
          {comparison.startsWith("-") ? (
            <FaArrowDown className="text-red-500 text-xl" />
          ) : (
            <FaArrowUp className="text-green-500 text-xl" />
          )}
        </div>
        <p
          className={`text-sm font-medium ${
            comparison.startsWith("-") ? "text-red-500" : "text-green-500"
          }`}
        >
          {comparisonText}{" "}
        </p>
        {chart && <div className="mt-4 w-full">{chart}</div>}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
