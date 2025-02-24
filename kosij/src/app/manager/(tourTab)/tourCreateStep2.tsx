"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { useState } from "react";

interface CreateTourStep2Props {
  onBack: () => void;
  onNext: () => void;
}

export default function CreateTourStep2({
  onBack,
  onNext,
}: CreateTourStep2Props) {
  type Activity = {
    time: string;
    description: string;
    locations: string[];
  };

  type Day = {
    title: string;
    activities: Activity[];
  };

  const [days, setDays] = useState<Day[]>([
    {
      title: "Day 1",
      activities: [
        {
          time: "07:00 AM",
          description:
            "Consultant guide picks you up at Tan Son Nhat and completes procedures for you to fly to Japan.",
          locations: ["Matsue Nishikigoi Center"],
        },
      ],
    },
  ]);

  const handleUpdateDayTitle = (dayIndex: number, value: string) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].title = value;
    setDays(updatedDays);
  };

  const handleAddDay = () => {
    setDays([
      ...days,
      {
        title: `Day ${days.length + 1}`,
        activities: [
          {
            time: "08:00 AM",
            description: "",
            locations: [""],
          },
        ],
      },
    ]);
  };

  const handleAddActivity = (dayIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities.push({
      time: "08:00 AM",
      description: "",
      locations: [""],
    });
    setDays(updatedDays);
  };

  const handleAddLocation = (dayIndex: number, activityIndex: number) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities[activityIndex].locations.push("");
    setDays(updatedDays);
  };

  return (
    <ManagerLayout title="Tour Create">
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          TOUR INFORMATION FORM
        </h2>

        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="border p-4 rounded-lg bg-gray-50 mb-6">
            <input
              type="text"
              value={day.title}
              onChange={(e) => handleUpdateDayTitle(dayIndex, e.target.value)}
              className="text-lg font-semibold w-full p-2 border rounded bg-white shadow-sm"
            />

            {day.activities.map((activity, activityIndex) => (
              <div
                key={activityIndex}
                className="bg-white p-4 rounded-lg shadow-sm mt-4"
              >
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Time:
                  </label>
                  <input
                    type="text"
                    value={activity.time}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Description:
                  </label>
                  <textarea
                    value={activity.description}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>

                {activity.locations.map((location, locationIndex) => (
                  <div key={locationIndex} className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Location {locationIndex + 1}:
                    </label>
                    <input
                      type="text"
                      value={location}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ))}

                <button
                  onClick={() => handleAddLocation(dayIndex, activityIndex)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2 shadow hover:bg-blue-600"
                >
                  ➕ Add Location
                </button>
              </div>
            ))}

            <button
              onClick={() => handleAddActivity(dayIndex)}
              className="bg-green-500 text-white px-4 py-2 rounded mt-4 shadow hover:bg-green-600"
            >
              ➕ Add Activity
            </button>
          </div>
        ))}

        <button
          onClick={handleAddDay}
          className="bg-purple-500 text-white px-4 py-2 rounded mt-4 shadow hover:bg-purple-600"
        >
          ➕ New Day
        </button>

        <div className="flex justify-between mt-6">
          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600"
          >
            ⬅ Back
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
