/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import TripDetail from "@/app/components/TripDetail/TripDetail";
import api from "@/config/axios.config";

import { Button, Empty } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import React, { useEffect, useState } from "react";

function Page() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const id = params.id;
  const { role } = useParams();
  const [tripData, setTripData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const tourId = searchParams.get("tourId");
  const LayoutComponent = role === "manager" ? ManagerLayout : SaleStaffLayout;

  useEffect(() => {
    if (!id) return;

    const fetchTripData = async () => {
      try {
        const response = await api.get(`/staff/trip/${id}`);
        const data = response.data.value;
        let data2: any[] = [];
        if (role === "manager") {
          const responseHistoryStaff = await api.get(
            `/staff-assignment-history?tripId=${id}`
          );
          data2 = responseHistoryStaff.data.value;
        }
        if (!data) throw new Error("No data returned from API");

        setTripData({
          staffHistory:
            role === "manager"
              ? data2.map((history) => ({
                  id: history.id,
                  staffId: history.staffId,
                  staffName: history.staffName,
                  taskId: history.taskId,
                  taskType: history.taskType,
                  workStartTime: history.workStartTime,
                  workEndTime: history.workEndTime,
                  note: history.note,
                  role: history.role,
                }))
              : [],
          customers: data.tripBookingsResponse.map((customer: any) => ({
            tripBookingId: customer.tripBookingId,
            customerName: customer.customerName,
            phoneNumber: customer.phoneNumber,
            email: customer.email,
          })),
          id: data.id,

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
  const handleSelectStaff = () => {
    router.push(`/manager/selectStaff?tripId=${id}&tourId=${tourId}`);
  };
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
        <TripDetail data={tripData} role={role as string} custom={false} />
        <div className="flex justify-between items-center mt-4 pl-6 pr-6">
          <Button
            size="large"
            onClick={() =>
              router.push(
                role === "sale"
                  ? "/sale/scheduled/trips"
                  : `/${role}/tours/${tourId}`
              )
            }
          >
            Back
          </Button>
          {role === "manager" && tripData.tripType !== "Customized" && (
            <Button type="primary" size="large" onClick={handleSelectStaff}>
              Assign
            </Button>
          )}
        </div>
      </div>
    </LayoutComponent>
  );
}

export default Page;
