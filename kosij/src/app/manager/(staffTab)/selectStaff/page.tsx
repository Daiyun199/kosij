"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { MapPinned, ShoppingCart } from "lucide-react";
import ProtectedRoute from "@/app/ProtectedRoute";

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

function SelectStaff() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const [tripId, setTripId] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [consultant, setConsultant] = useState<boolean | null>(false);
  const [tourId, setTourId] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTripId(params.get("tripId"));
    setRequestId(params.get("requestId"));
    setTourId(params.get("tourId"));
    const consultantParam = params.get("consultant");
    setConsultant(consultantParam === "true");
  }, []);
  const filteredStaffOptions =
    consultant === true
      ? staffOptions.filter((staff) => staff.id === "consultant")
      : requestId && !tripId
      ? staffOptions.filter((staff) => staff.id === "sale")
      : staffOptions;

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Select Staff">
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-12 rounded-2xl shadow-2xl w-[800px] h-[650px] flex flex-col justify-between text-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800">
                Please select the staff
              </h2>
              <p className="text-gray-500 text-base mt-3">
                Select staff to assign to a trip
              </p>
            </div>

            <div className="flex justify-center gap-10">
              {filteredStaffOptions.map((staff) => (
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

            {/* <div className="flex justify-center">
              <Button
                className={cn(
                  "py-4 px-12 rounded-full text-white text-lg font-bold flex items-center gap-3 transition-all",
                  selected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-125 shadow-lg shadow-blue-400 hover:scale-110 ring-2 ring-blue-500"
                    : "bg-gray-300 cursor-not-allowed"
                )}
                disabled={!selected}
                onClick={() => {
                  if (!tripId && !requestId) return;

                  const url =
                    selected === "sale"
                      ? `/manager/selectStaff/sales?${
                          tripId ? `tripId=${tripId}` : `requestId=${requestId}`
                        }`
                      : `/manager/selectStaff/consultants?tripId=${tripId}${
                          consultant ? "&customize=true" : ""
                        }`;

                  router.push(url);
                }}
              >
                <div className="text-5xl text-blue-500">{staff.icon}</div>
                <span className="font-semibold text-xl">{staff.label}</span>
              </Card>
            ))} */}
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
              onClick={() => {
                if (!tripId && !requestId && !tourId) return;

                const baseParams = [];
                if (tripId) baseParams.push(`tripId=${tripId}`);
                if (requestId) baseParams.push(`requestId=${requestId}`);
                if (tourId) baseParams.push(`tourId=${tourId}`);
                if (consultant) baseParams.push(`customize=true`);

                const url =
                  selected === "sale"
                    ? `/manager/selectStaff/sales?${baseParams.join("&")}`
                    : `/manager/selectStaff/consultants?${baseParams.join(
                        "&"
                      )}`;

                router.push(url);
              }}
            >
              🚀 Continue
            </Button>
          </div>
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}
export default SelectStaff;
