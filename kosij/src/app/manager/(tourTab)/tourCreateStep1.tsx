"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { useState } from "react";

export default function CreateTourStep1({ onNext }: { onNext: () => void }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tourName, setTourName] = useState("The Koi Odyssey || 3D2N");
  const [day, setDay] = useState(3);
  const [night, setNight] = useState(2);
  const [hotelService, setHotelService] = useState("3 stars");
  const [availableSlot, setAvailableSlot] = useState(3);
  const [departure, setDeparture] = useState(
    "Tan Son Nhat International Airport (Ho Chi Minh City)"
  );
  const [destination, setDestination] = useState(
    "Narita International Airport (Tokyo)"
  );

  return (
    <ManagerLayout title="Tour Create">
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">
          TOUR INFORMATION FORM
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">Tour name:</label>
          <input
            type="text"
            value={tourName}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Day:</label>
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Night:</label>
            <input
              type="number"
              value={night}
              onChange={(e) => setNight(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Hotel service:</label>
            <input
              type="text"
              value={hotelService}
              onChange={(e) => setHotelService(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Available Slot:</label>
          <input
            type="number"
            value={availableSlot}
            onChange={(e) => setAvailableSlot(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Departure points:</label>
          <input
            type="text"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">
            Destination points:
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            Next ➜
          </button>
        </div>
      </div>
    </ManagerLayout>
  );
}
