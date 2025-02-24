import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import React from "react";

const BookingPage: React.FC = () => {
  return (
    <ManagerLayout title="">
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 flex flex-col items-center p-8">
        <div className="grid grid-cols-3 gap-6 max-w-5xl w-full">
          {/** Top Row */}
          <Card title="Customer Name" bgColor="bg-yellow-500 text-white">
            DO HOANG PHUONG
          </Card>
          <Card title="Affordable Budget" bgColor="bg-pink-500 text-white">
            15,000,000
          </Card>
          <Card title="List of Farm" bgColor="bg-blue-400 text-white">
            OMOSAKO KOI FARM, MARUDO KOI FARM, DAINICHI KOI FARM, SAKAI FISH
            FARM
          </Card>
          {/** Middle Row - Leaving the center empty */}
          <Card title="Start Date" bgColor="bg-orange-400 text-white">
            2025-05-15 <br /> to <br /> 2025-05-20
          </Card>
          <div></div> {/** Empty Center Cell */}
          <Card title="Number of Customers" bgColor="bg-purple-500 text-white">
            4 ADULTS, 1 CHILD (10 YEARS OLD)
          </Card>
          {/** Bottom Row */}
          <Card title="List of Koi Varieties" bgColor="bg-blue-600 text-white">
            HIGH-QUALITY SHOWA OR SANKE
          </Card>
          <Card title="Special Requirements" bgColor="bg-green-600 text-white">
            VEGETARIAN MEALS
          </Card>
          <Card title="Departure Airport" bgColor="bg-yellow-400 text-white">
            TAN SON NHAT INTERNATIONAL AIRPORT (TIA)
          </Card>
        </div>

        {/** Buttons */}
        <div className="mt-8 flex gap-6">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition text-lg font-semibold">
            Back
          </button>
          <button className="px-8 py-3 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 transition text-lg font-semibold">
            Deny
          </button>
          <button className="px-8 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition text-lg font-semibold">
            Approval
          </button>
        </div>
      </div>
    </ManagerLayout>
  );
};

interface CardProps {
  title: string;
  bgColor: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, bgColor, children }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div
        className={`px-6 py-3 rounded-t-xl font-bold ${bgColor} w-full text-center text-lg`}
      >
        {title}
      </div>
      <div className="mt-0 p-6 border rounded-b-xl bg-white shadow-xl min-h-[120px] text-center flex items-center justify-center w-full text-gray-700 text-lg font-medium">
        {children}
      </div>
    </div>
  );
};

export default BookingPage;
