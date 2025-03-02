/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import PassengerList from "@/app/components/PassenegerList/PassenegerList";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import TripBookingInfo from "@/app/components/TripBookingInfo/TripBookingInfo";

import api from "@/config/axios.config";
import { Passenger } from "@/model/Passenger";
import { Button, Card, Empty } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const id = params.id;
  const { role } = useParams();
  const LayoutComponent = role === "manager" ? ManagerLayout : SaleStaffLayout;
  const [passengerData, setPassengerData] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [tripBooking, setTripBooking] = useState(null);
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const passengerResponse = await api.get(`/trip/${id}/trip-bookings`);
        const tripBookings = passengerResponse.data.value;
        if (!tripBookings.length) throw new Error("No trip bookings found");

        const passengerRequests = tripBookings.map(
          (booking: { tripBookingId: number }) =>
            api.get(`/trip-booking/${booking.tripBookingId}/passengers`)
        );

        const passengerResponses = await Promise.all(passengerRequests);
        const passengers = passengerResponses.flatMap((res) => res.data.value);
        setPassengerData(passengers);

        const tripBookingResponse = await api.get(`/trip-booking/${id}`);
        const tripBookingData = tripBookingResponse.data.value;

        setTripBooking({ ...tripBookingData, id });
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  const handleSelectStaff = () => {
    router.push(`/manager/selectStaff?tripId=${id}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <LayoutComponent title="Passenger List">
      <div className="p-6 max-w-5xl mx-auto">
        {tripBooking && <TripBookingInfo tripBooking={tripBooking} />}
        {passengerData.length ? (
          <PassengerList passengers={passengerData} />
        ) : (
          <Card className="flex justify-center items-center h-40">
            <Empty description="No passengers found" />
          </Card>
        )}
      </div>
    </LayoutComponent>
  );
}

export default Page;
