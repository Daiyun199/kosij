"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { Activity } from "@/model/Activity";
import { Day } from "@/model/Day";
import { useState, useEffect } from "react";
import { FiArrowLeft, FiPlus, FiTrash } from "react-icons/fi";

interface CreateTourStep2Props {
  onBack: () => void;
  onNext: () => void;
  data: Day[];
  updateData: (data: Day[]) => void;
}

export default function CreateTourStep2({
  onBack,
  onNext,
  data,
  updateData,
}: CreateTourStep2Props) {
  const [days, setDays] = useState<Day[]>(data);

  useEffect(() => {
    updateData(days);
  }, [days]);

  useEffect(() => {
    setDays(data);
  }, [data]);

  const handleUpdateDayTitle = (dayIndex: number, value: string) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].title = value;
    setDays(updatedDays);
  };

  const handleUpdateActivity = (
    dayIndex: number,
    activityIndex: number,
    field: keyof Activity,
    value: string | string[]
  ) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities[activityIndex][field] = value as never;
    setDays(updatedDays);
  };

  const handleAddDay = () => {
    setDays([...days, { title: `Day ${days.length + 1}`, activities: [] }]);
  };

  const handleDeleteDay = (dayIndex: number) => {
    if (window.confirm("Are you sure you want to delete this day?")) {
      setDays(days.filter((_, index) => index !== dayIndex));
    }
  };

  const handleAddActivity = (dayIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities.push({
      time: "",
      description: "",
      locations: [],
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

  const handleAddLocation = (dayIndex: number, activityIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities[activityIndex].locations.push("");
    setDays(updatedDays);
  };

  const handleDeleteLocation = (
    dayIndex: number,
    activityIndex: number,
    locationIndex: number
  ) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      const updatedDays = [...days];
      updatedDays[dayIndex].activities[activityIndex].locations.splice(
        locationIndex,
        1
      );
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
            className="border p-4 rounded-lg bg-gray-50 mb-6 relative "
          >
            <input
              type="text"
              value={day.title}
              onChange={(e) => handleUpdateDayTitle(dayIndex, e.target.value)}
              className="text-lg font-semibold w-full p-2 border rounded bg-white shadow-sm mt-3"
            />
            <button
              onClick={() => handleDeleteDay(dayIndex)}
              className="absolute top-1 right-1 text-red-500"
            >
              <FiTrash size={20} />
            </button>

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
                    type="text"
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

                {activity.locations.map((location, locationIndex) => (
                  <div key={locationIndex} className="mb-3 relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Location {locationIndex + 1}:
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => {
                        const updatedLocations = [...activity.locations];
                        updatedLocations[locationIndex] = e.target.value;
                        handleUpdateActivity(
                          dayIndex,
                          activityIndex,
                          "locations",
                          updatedLocations
                        );
                      }}
                      className="w-full p-2 border rounded"
                    />
                    <button
                      onClick={() =>
                        handleDeleteLocation(
                          dayIndex,
                          activityIndex,
                          locationIndex
                        )
                      }
                      className="absolute top-0 right-0 text-red-500"
                    >
                      <FiTrash size={16} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => handleAddLocation(dayIndex, activityIndex)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2 shadow hover:bg-blue-600 flex items-center gap-2"
                >
                  <FiPlus /> Add Location
                </button>
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

        <button
          onClick={handleAddDay}
          className="bg-purple-500 text-white px-4 py-2 rounded mt-4 shadow hover:bg-purple-600 flex items-center gap-2"
        >
          <FiPlus /> New Day
        </button>

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
