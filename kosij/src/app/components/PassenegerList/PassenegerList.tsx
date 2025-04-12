/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Card, Button, Popconfirm } from "antd";
import { Passenger } from "@/model/Passenger";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { CalendarDays, Globe, Mail, Phone, CheckCircle } from "lucide-react";
interface PassengerListProps {
  passengers: Passenger[];
  onUpdatePassenger: (updatedPassenger: Passenger) => void;
  tripBookingStatus: string;
  role?: string;
}

const PassengerList: React.FC<PassengerListProps> = ({
  passengers,
  onUpdatePassenger,
  tripBookingStatus,
  role,
}) => {
  const [checkedPassengers, setCheckedPassengers] = useState<number[]>([]);

  const handleCheckVisa = (passenger: Passenger) => {
    const newVisaStatus = !passenger.hasVisa;
    onUpdatePassenger({ ...passenger, hasVisa: newVisaStatus });

    setCheckedPassengers((prev) => [...prev, passenger.id]);
    toast.success(
      `Updated visa status for ${passenger.fullName} to ${
        newVisaStatus ? "Granted" : "Not Granted"
      }`
    );
  };

  const PassportIcon = () => (
    <svg
      className="w-4 h-4 mr-2 text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <circle cx="12" cy="10" r="2" />
      <path d="M18 17v-1a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1" />
    </svg>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {passengers.map((passenger) => (
        <Card
          key={passenger.id}
          className="p-5 shadow-sm border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3
                className={`text-lg font-bold ${
                  passenger.isRepresentative ? "text-blue-600" : "text-gray-800"
                }`}
              >
                {passenger.fullName}
              </h3>
              {passenger.isRepresentative && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Representative
                </span>
              )}
            </div>
            <div className="flex space-x-1">
              <span
                className={`inline-block w-2 h-2 rounded-full mt-2 ${
                  passenger.isCheckIn ? "bg-green-500" : "bg-gray-300"
                }`}
              ></span>
              <span
                className={`inline-block w-2 h-2 rounded-full mt-2 ${
                  passenger.isCheckOut ? "bg-green-500" : "bg-gray-300"
                }`}
              ></span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center text-sm">
              <CalendarDays className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                {passenger.dateOfBirth} | {passenger.sex}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Globe className="w-4 h-4 mr-2 text-gray-400" />
              <span>{passenger.nationality}</span>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <span>{passenger.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <span>{passenger.phoneNumber}</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-4 h-4 mr-2 text-gray-400">
                <PassportIcon />
              </div>
              <span>{passenger.passport || "Not provided"}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge
              className={
                passenger.ageGroup === "Adult"
                  ? "bg-blue-100 text-blue-800"
                  : passenger.ageGroup === "Child"
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }
            >
              {passenger.ageGroup}
            </Badge>

            <Badge
              className={
                passenger.hasVisa
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }
            >
              {passenger.hasVisa ? "Visa Ready" : "Visa Required"}
            </Badge>

            <Badge
              className={
                passenger.isCheckIn
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {passenger.isCheckIn ? "Checked In" : "Pending Check-in"}
            </Badge>

            <Badge
              className={
                passenger.isCheckOut
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {passenger.isCheckOut ? "Checked Out" : "Active"}
            </Badge>
          </div>

          {/* Action Button */}
          {["Deposited"].includes(tripBookingStatus) &&
            role !== "manager" &&
            !checkedPassengers.includes(passenger.id) && (
              <Popconfirm
                title="Confirm visa status change?"
                okText="Confirm"
                cancelText="Cancel"
                onConfirm={() => handleCheckVisa(passenger)}
              >
                <Button
                  type="primary"
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
                  icon={<CheckCircle className="w-4 h-4 mr-1" />}
                >
                  Verify Visa
                </Button>
              </Popconfirm>
            )}
        </Card>
      ))}
    </div>
  );
};

export default PassengerList;
