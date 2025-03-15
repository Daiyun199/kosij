/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";

import { Passenger } from "@/model/Passenger";
import { Badge } from "@/components/ui/badge";
import api from "@/config/axios.config";
import { toast } from "react-toastify";

interface PassengerListProps {
  passengers: Passenger[];
}

const PassengerList: React.FC<PassengerListProps> = ({ passengers }) => {
  const handleCheckVisa = async (passenger: Passenger) => {
    try {
      await api.put(
        `/trip-booking/${passenger.tripBookingId}/passenger/${passenger.id}/has-visa`,
        {
          hasVisa: true,
        }
      );

      toast.success(`Updated visa status for ${passenger.fullName}`);
    } catch (error: any) {
      console.error("Error updating visa status:", error);

      const errorMessage =
        error.response?.data?.value || "Failed to update visa status";

      toast.error(`Error for ${passenger.fullName}: ${errorMessage}`);
    }
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
          <Button
            type="primary"
            className="mt-4"
            onClick={() => handleCheckVisa(passenger)}
          >
            Check
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default PassengerList;
