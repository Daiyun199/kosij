"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { useState, useEffect } from "react";

interface Step1Props {
  onNext: () => void;
  data: {
    tourName?: string;
    night?: number;
    day?: number;
    departure?: string;
    destination?: string;
    registrationDaysBefore?: number;
    registrationConditions?: string;
  };
  updateData: (data: object) => void;
}

export default function CreateTourStep1({
  onNext,
  data,
  updateData,
}: Step1Props) {
  const [tourName, setTourName] = useState(data.tourName || "");
  const [night, setNight] = useState(data.night || 0);
  const [day, setDay] = useState((data.night || 0) + 1);
  const [departure, setDeparture] = useState(data.departure || "");
  const [destination, setDestination] = useState(data.destination || "");
  const [registrationDaysBefore, setRegistrationDaysBefore] = useState(
    data.registrationDaysBefore || 0
  );
  const [registrationConditions, setRegistrationConditions] = useState(
    data.registrationConditions || ""
  );

  // Cập nhật day khi night thay đổi
  useEffect(() => {
    setDay(night + 1);
  }, [night]);

  // Cập nhật dữ liệu vào state chung
  useEffect(() => {
    updateData({
      tourName,
      night,
      day, // Gửi giá trị day mới
      departure,
      destination,
      registrationDaysBefore,
      registrationConditions,
    });
  }, [
    tourName,
    night,
    day,
    departure,
    destination,
    registrationDaysBefore,
    registrationConditions,
  ]);

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
            onChange={(e) => setTourName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Night:</label>
            <input
              type="number"
              value={night}
              min={0}
              onChange={(e) => setNight(Math.max(0, Number(e.target.value)))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Day (Auto):</label>
            <input
              type="number"
              value={day}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
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

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">
              Registration Days Before:
            </label>
            <input
              type="number"
              value={registrationDaysBefore}
              onChange={(e) =>
                setRegistrationDaysBefore(Number(e.target.value))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Registration Conditions:
            </label>
            <input
              type="text"
              value={registrationConditions}
              onChange={(e) => setRegistrationConditions(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
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
