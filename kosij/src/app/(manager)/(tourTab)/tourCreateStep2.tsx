"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { useState } from "react";

export default function CreateTourStep2({ onBack }: { onBack: () => void }) {
  const [time, setTime] = useState("07:00 AM");
  const [description, setDescription] = useState(
    "Consultant guide picks you up at Tan Son Nhat and completes procedures for you to fly to Japan on flight VJ828 SGN-NRT. Passengers can rest and have breakfast on the Vietjet Air flight."
  );
  const [location, setLocation] = useState("Matsue Nishikigoi Center");

  return (
    <ManagerLayout title="Tour Create">
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">
          TOUR INFORMATION FORM
        </h2>

        {/* Day 1 */}
        <div className="border p-4 rounded-lg bg-gray-100 mb-4">
          <h3 className="text-lg font-semibold mb-2">Day 1</h3>
          <input
            type="text"
            value="Ho Chi Minh - Tokyo - Vokohana Farm || Breakfast on air flight"
            className="w-full p-2 border rounded mb-3"
            readOnly
          />

          <div className="mb-4">
            <label className="block text-sm font-medium">Time:</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <button className="bg-gray-500 text-white px-4 py-2 rounded">
            ➕ Add Location
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded ml-2">
            ➕ Add Activity
          </button>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            ⬅ Back
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Next ➜
          </button>
        </div>
      </div>
    </ManagerLayout>
  );
}
