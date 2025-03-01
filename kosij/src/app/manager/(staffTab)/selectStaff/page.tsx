"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { MapPinned, ShoppingCart } from "lucide-react";

const staffOptions = [
  {
    id: "consultant",
    label: "Consultant Staff",
    icon: <MapPinned size={48} className="text-blue-600" />,
  },
  {
    id: "sale",
    label: "Sale Staff",
    icon: <ShoppingCart size={48} className="text-orange-500" />,
  },
];

export default function SelectStaff() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  return (
    <ManagerLayout title="Select Staff">
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-12 rounded-2xl shadow-2xl w-[800px] h-[650px] flex flex-col justify-between text-center">
          {/* Tiêu đề */}
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              Please select the staff
            </h2>
            <p className="text-gray-500 text-base mt-3">
              Select staff to assign to a trip
            </p>
          </div>

          <div className="flex justify-center gap-10">
            {staffOptions.map((staff) => (
              <Card
                key={staff.id}
                className={cn(
                  "p-8 border rounded-xl cursor-pointer w-[220px] flex flex-col items-center gap-5 transition-all hover:scale-105",
                  selected === staff.id
                    ? "border-blue-500 bg-blue-100 shadow-md"
                    : "border-gray-300 bg-gray-50"
                )}
                onClick={() => setSelected(staff.id)}
              >
                <div className="text-5xl text-blue-500">{staff.icon}</div>
                <span className="font-semibold text-xl">{staff.label}</span>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              className={cn(
                "py-4 px-12 rounded-full text-white text-lg font-bold flex items-center gap-3 transition-all",
                selected
                  ? "bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-125 shadow-lg shadow-blue-400 hover:scale-110 ring-2 ring-blue-500"
                  : "bg-gray-300 cursor-not-allowed"
              )}
              disabled={!selected}
              onClick={() =>
                selected && router.push(`/next-step?staff=${selected}`)
              }
            >
              🚀 Continue
            </Button>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}
