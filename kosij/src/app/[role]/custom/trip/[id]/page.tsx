"use client";

import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import TripDetail from "@/app/components/TripDetail/TripDetail";
import api from "@/config/axios.config";
import { TripData } from "@/model/TripData";
import { Button, Empty } from "antd";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import React, { useEffect, useState } from "react";

function Page() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const id = params.id;
  const searchParams = useSearchParams();
  const { role } = useParams();
  const LayoutComponent = role === "manager" ? ManagerLayout : SaleStaffLayout;
  const tripRequestId = searchParams.get("requestId");
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tripRequestStatus, setTripRequestStatus] = useState();
  useEffect(() => {
    if (!id) return;

    const fetchTripData = async () => {
      try {
        const response = await api.get(`/staff/trip/${id}`);
        const data = response.data.value;
        if (tripRequestId) {
          const tripRequestResponse = await api.get(
            `/staff/trip-request/${tripRequestId}`
          );
          const dataTripRequest = tripRequestResponse.data.value;
          setTripRequestStatus(dataTripRequest.requestStatus);
        }
        if (!data) throw new Error("No data returned from API");
        console.log(data);
        setTripData({
          requestId: tripRequestId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          customers: data.tripBookingsResponse.map((customer: any) => ({
            tripBookingId: customer.tripBookingId,
            customerName: customer.customerName,
            phoneNumber: customer.phoneNumber,
            email: customer.email,
          })),
          id: data.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          notes: data.notes.map((note: any) => ({
            userName: note.userName,
            note: note.note,
          })),
          consultingStaffName: data.consultingStaffName,
          salesStaffName: data.salesStaffName,
          tripType: data.tripType,
          departureDate: data.departureDate,
          returnDate: data.returnDate,
          maxGroupSize: data.maxGroupSize,
          minGroupSize: data.minGroupSize,
          availableSlot: data.availableSlot,
          daysRemaining: data.daysRemaining,
          pricingRate: data.pricingRate,
          visaFee: data.tourResponse.visaFee,
          registrationDaysBefore: data.tourResponse.registrationDaysBefore,
          registrationConditions: data.tourResponse.registrationConditions,
          averageRating: data.tourResponse.averageRating,
          tourStatus: data.tourResponse.tourStatus,
          tripStatus: data.tripStatus,
          price: {
            adult:
              data.tripPrice.find(
                (p: { ageGroup: string }) => p.ageGroup === "Adult"
              )?.price || "0",
            children1_11:
              data.tripPrice.find(
                (p: { ageGroup: string }) => p.ageGroup === "Child"
              )?.price || "0",
            children12_plus:
              data.tripPrice.find(
                (p: { ageGroup: string }) => p.ageGroup === "Infant"
              )?.price || "0",
          },
          tour: {
            title: data.tourResponse.tourName,
            imageUrl: data.tourResponse.imageUrl,
            departurePoint: data.tourResponse.departurePoint,
            destinationPoint: data.tourResponse.destinationPoint,
            duration: `${data.tourResponse.days} Days ${data.tourResponse.nights} Nights`,
            tourPriceIncludes: data.tourResponse.tourPriceInclude
              ? data.tourResponse.tourPriceInclude.split(", ")
              : [],
            tourPriceNotIncludes: data.tourResponse.tourPriceNotInclude
              ? data.tourResponse.tourPriceNotInclude.split(", ")
              : [],
            cancelPolicy: data.tourResponse.cancellationPolicy.map(
              (p: { description: string }) => p.description
            ),
            depositPolicy: data.tourResponse.paymentPolicy.map(
              (p: { description: string }) => p.description
            ),
            promotionPolicy: data.tourResponse.promotionPolicy.map(
              (p: { description: string }) => p.description
            ),
            itinerary:
              data.tourResponse.tourDetails?.map(
                (detail: {
                  day: number;
                  itineraryName: string;
                  itineraryDetails: {
                    time: string;
                    description: string;
                    farmId: number | null;
                    name: string | null;
                  }[];
                }) => ({
                  day: detail.day,
                  itineraryName: detail.itineraryName,
                  itineraryDetails: detail.itineraryDetails.map(
                    (itinerary) => ({
                      time: itinerary.time,
                      description: itinerary.description,
                      farmId: itinerary.farmId,
                      name: itinerary.name,
                    })
                  ),
                })
              ) || [],
          },
        });
      } catch (error) {
        console.error("Lỗi tải dữ liệu trip:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (!tripData) {
    return (
      <LayoutComponent title="Trip Detail">
        <div className="p-6 max-w-5xl mx-auto flex justify-center">
          <Empty description="Trip not found" />
        </div>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent title="Trip Detail">
      <div className="p-6 max-w-5xl mx-auto">
        <TripDetail data={tripData} role={role as string} custom={true} />

        <div className="flex justify-between mt-4 pl-6 pr-6">
          {role === "sale" && tripRequestStatus === "ManagerRejected" && (
            <Button
              type="default"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => router.push(`/sale/rejected/update/${id}`)}
            >
              Update
            </Button>
          )}

          <Button
            type="default"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() =>
              router.push(
                role === "manager"
                  ? `/manager/requests/${tripRequestId}`
                  : `/sale/requests/${tripRequestId}`
              )
            }
          >
            Back
          </Button>
        </div>
      </div>
    </LayoutComponent>
  );
}

export default Page;
