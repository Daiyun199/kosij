"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { Activity } from "@/model/Activity";
import { Day } from "@/model/Day";
import { useState, useEffect } from "react";
import { FiArrowLeft, FiPlus, FiTrash } from "react-icons/fi";
import { Select } from "antd";
import api from "@/config/axios.config";

interface CreateTourStep2Props {
  onBack: () => void;
  onNext: () => void;
  data: Day[];
  updateData: (data: Day[]) => void;
  dayStep1: number;
}

interface Farm {
  id: number;
  farmName: string;
  location: string;
}

export default function CreateTourStep2({
  onBack,
  onNext,
  data,
  updateData,
  dayStep1,
}: CreateTourStep2Props) {
  const [days, setDays] = useState<Day[]>(Array.isArray(data) ? data : []);

  const [farms, setFarms] = useState<Farm[]>([]);

  useEffect(() => {
    updateData(days);
  }, [days]);

  useEffect(() => {
    setDays((prevDays) => {
      let updatedDays = [...prevDays];

      if (updatedDays.length < dayStep1) {
        for (let i = updatedDays.length; i < dayStep1; i++) {
          updatedDays.push({
            title: `Day ${i + 1}`,
            activities: [
              {
                time: "",
                description: "",
                locations: "",
              },
            ],
          });
        }
      } else if (updatedDays.length > dayStep1) {
        updatedDays = updatedDays.slice(0, dayStep1);
      }

      return updatedDays;
    });
  }, [dayStep1]);

  useEffect(() => {
    api
      .get("/farms/active")
      .then((response) => {
        if (response.data.value) {
          setFarms(response.data.value);
        }
      })
      .catch((error) => console.error("Error fetching farms:", error));
  }, []);

  const handleUpdateDayTitle = (dayIndex: number, value: string) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].title = value;
    setDays(updatedDays);
  };

  const handleUpdateActivity = (
    dayIndex: number,
    activityIndex: number,
    field: keyof Activity,
    value: string
  ) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities[activityIndex][field] = value;
    setDays(updatedDays);
  };

  const handleAddActivity = (dayIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities.push({
      time: "",
      description: "",
      locations: "",
    });
    setDays(updatedDays);
  };

  const handleDeleteActivity = (dayIndex: number, activityIndex: number) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      const updatedDays = [...days];
      updatedDays[dayIndex].activities.splice(activityIndex, 1);
      setDays(updatedDays);
    }
  };

  return (
    <ManagerLayout title="Tour Create">
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          TOUR INFORMATION FORM
        </h2>

        {days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className="border p-4 rounded-lg bg-gray-50 mb-6 relative"
          >
            <input
              type="text"
              value={day.title}
              onChange={(e) => handleUpdateDayTitle(dayIndex, e.target.value)}
              className="text-lg font-semibold w-full p-2 border rounded bg-white shadow-sm mt-3"
            />

            {day.activities.map((activity, activityIndex) => (
              <div
                key={activityIndex}
                className="bg-white p-4 rounded-lg shadow-sm mt-4 relative"
              >
                <button
                  onClick={() => handleDeleteActivity(dayIndex, activityIndex)}
                  className="absolute top-2 right-2 text-red-500"
                >
                  <FiTrash size={20} />
                </button>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Time:
                  </label>
                  <input
                    type="time"
                    value={activity.time}
                    onChange={(e) =>
                      handleUpdateActivity(
                        dayIndex,
                        activityIndex,
                        "time",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Description:
                  </label>
                  <textarea
                    value={activity.description}
                    onChange={(e) =>
                      handleUpdateActivity(
                        dayIndex,
                        activityIndex,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Location:
                  </label>
                  <Select
                    value={activity.locations}
                    onChange={(value) =>
                      handleUpdateActivity(
                        dayIndex,
                        activityIndex,
                        "locations",
                        value
                      )
                    }
                    className="w-full"
                    placeholder="Select a farm"
                    options={farms.map((farm) => ({
                      label: farm.farmName,
                      value: farm.id,
                    }))}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() => handleAddActivity(dayIndex)}
              className="bg-green-500 text-white px-4 py-2 rounded mt-4 shadow hover:bg-green-600 flex items-center gap-2"
            >
              <FiPlus /> Add Activity
            </button>
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 flex items-center gap-2"
          >
            <FiArrowLeft size={20} /> Back
          </button>
          <button
            onClick={onNext}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Next ➜
          </button>
        </div>
      </div>
    </ManagerLayout>
  );
}
