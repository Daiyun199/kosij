"use client";
import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface TimeFilterProps {
  onChange: (selectedTime: string) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ onChange }) => {
  const [selectedTime, setSelectedTime] = useState("day");

  const handleChange = (value: string) => {
    setSelectedTime(value);
    onChange(value);
  };

  return (
    <div className="flex justify-start mb-4">
      <Select value={selectedTime} onValueChange={handleChange}>
        <SelectTrigger className="border border-gray-300 p-2 rounded-md shadow-md !w-32 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <SelectValue placeholder="Chọn thời gian" />
        </SelectTrigger>
        <SelectContent className="rounded-md shadow-lg">
          <SelectItem value="day">Ngày</SelectItem>
          <SelectItem value="month">Tháng</SelectItem>
          <SelectItem value="year">Năm</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeFilter;
