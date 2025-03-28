/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Card, Button, Popconfirm } from "antd";
import { Passenger } from "@/model/Passenger";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

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
  const handleCheckVisa = (passenger: Passenger) => {
    const newVisaStatus = !passenger.hasVisa;
    onUpdatePassenger({ ...passenger, hasVisa: newVisaStatus });
    toast.success(
      `Temporarily updated visa status for ${passenger.fullName} to ${
        newVisaStatus ? "Granted" : "Not Granted"
      }`
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {passengers.map((passenger) => (
        <Card
          key={passenger.id}
          className="p-4 shadow-md border border-gray-200"
        >
          <h3
            className={`text-lg font-semibold ${
              passenger.isRepresentative ? "text-blue-600" : ""
            }`}
          >
            {passenger.fullName}
          </h3>
          <p className="text-sm text-gray-600">
            {passenger.dateOfBirth} | {passenger.sex}
          </p>
          <p className="text-sm text-gray-600">{passenger.nationality}</p>
          <p className="text-sm">📧 {passenger.email}</p>
          <p className="text-sm">📞 {passenger.phoneNumber}</p>
          <p className="text-sm">🛂 {passenger.passport}</p>

          <div className="mt-2 flex gap-2">
            <Badge
              variant="outline"
              className={
                passenger.ageGroup === "Adult"
                  ? "border-blue-500 text-blue-500"
                  : passenger.ageGroup === "Child"
                  ? "border-green-500 text-green-500"
                  : "border-orange-500 text-orange-500"
              }
            >
              {passenger.ageGroup}
            </Badge>

            <Badge variant={passenger.hasVisa ? "default" : "destructive"}>
              {passenger.hasVisa ? "Visa ✅" : "No Visa ❌"}
            </Badge>
          </div>

          {["Drafted", "Deposited"].includes(tripBookingStatus) &&
            role !== "manager" && (
              <Popconfirm
                title="Are you sure you want to change the visa status?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleCheckVisa(passenger)}
              >
                <Button type="primary" className="mt-4">
                  Check
                </Button>
              </Popconfirm>
            )}
        </Card>
      ))}
    </div>
  );
};

export default PassengerList;
