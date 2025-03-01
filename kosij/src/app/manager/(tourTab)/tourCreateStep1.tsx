"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { Button, Upload } from "antd";
import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
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
    standardPrice?: number;
    visaFee?: number;
    img?: File | null;
  };
  updateData: (data: object) => void;
}

export default function CreateTourStep1({
  onNext,
  data,
  updateData,
}: Step1Props) {
  const [tourName, setTourName] = useState(data.tourName || "");
  const [night, setNight] = useState(data.night || 1);
  const [day, setDay] = useState((data.night || 0) + 1);
  const [departure, setDeparture] = useState(data.departure || "");
  const [destination, setDestination] = useState(data.destination || "");
  const [registrationDaysBefore, setRegistrationDaysBefore] = useState(
    data.registrationDaysBefore || 1
  );
  const [registrationConditions, setRegistrationConditions] = useState(
    data.registrationConditions || ""
  );
  const [standardPrice, setStandardPrice] = useState(data.standardPrice || 0);
  const [visaFee, setVisaFee] = useState(data.visaFee || 0);
  const [img, setImg] = useState<File | null>(data.img || null);
  useEffect(() => {
    setDay(night + 1);
  }, [night]);

  useEffect(() => {
    updateData({
      tourName,
      night,
      day,
      departure,
      destination,
      registrationDaysBefore,
      registrationConditions,
      standardPrice,
      visaFee,
      img,
    });
  }, [
    tourName,
    night,
    day,
    departure,
    destination,
    registrationDaysBefore,
    registrationConditions,
    standardPrice,
    visaFee,
    img,
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = (file: File) => {
    setImg(file);
    return false;
  };

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
              min={1}
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
              min={1}
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

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">
              Standard Price ($):
            </label>
            <input
              type="number"
              value={standardPrice}
              min={0}
              onChange={(e) =>
                setStandardPrice(Math.max(0, Number(e.target.value)))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Visa Fee ($):</label>
            <input
              type="number"
              value={visaFee}
              min={0}
              onChange={(e) => setVisaFee(Math.max(0, Number(e.target.value)))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">
            Upload Tour Image:
          </label>
          <Upload
            beforeUpload={handleUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          {img && (
            <Image
              src={URL.createObjectURL(img)}
              alt="Tour"
              width={300}
              height={200}
              className="mt-2 rounded-lg"
            />
          )}
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
