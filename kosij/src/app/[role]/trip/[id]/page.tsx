"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import TripDetail from "@/app/components/TripDetail/TripDetail";
import api from "@/config/axios.config";
import { TripData } from "@/model/TripData";
import { Button } from "antd";
import { useParams, useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

function Page() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const id = params.id;
  const { role } = useParams();
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const LayoutComponent = role === "manager" ? ManagerLayout : SaleStaffLayout;
  useEffect(() => {
    if (!id) return;

    const fetchTripData = async () => {
      try {
        const response = await api.get(`/staff/trip/${id}`);
        const data = response.data.value;
        // const customerResponse = await api.get(`trip/${id}/trip-bookings`);
        // const customerData = customerResponse.data.value;
        if (!data) throw new Error("No data returned from API");
        // if (!customerData) throw new Error("No Customer Booking");

        setTripData({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          customers: data.tripBookingsResponse.map((customer: any) => ({
            tripBookingId: customer.tripBookingId,
            customerName: customer.customerName,
            phoneNumber: customer.phoneNumber,
            email: customer.email,
          })),
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
  const handleSelectStaff = () => {
    router.push(`/manager/selectStaff?tripId=${id}`);
  };
  if (loading) return <p>Loading...</p>;
  if (!tripData) return <p>Trip not found</p>;

  return (
    <LayoutComponent title="Trip Detail">
      <div className="p-6 max-w-5xl mx-auto">
        <TripDetail data={tripData} role={role as string} />
        {role === "manager" && (
          <div className="p-6 max-w-5xl mx-auto flex justify-end">
            <Button type="primary" size="large" onClick={handleSelectStaff}>
              Assign
            </Button>
          </div>
        )}
      </div>
    </LayoutComponent>
  );
}

export default Page;
