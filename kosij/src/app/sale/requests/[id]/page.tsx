"use client";

import { Button, Card, Descriptions, Tag } from "antd";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/config/axios.config";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import { TripRequestScpeacial } from "@/model/TripRequestSpeacial";

const TripRequestDetail = () => {
  const [trip, setTrip] = useState<TripRequestScpeacial | null>(null);
  const params = useParams() as { id: string };
  const router = useRouter();
  const id = params.id;
  useEffect(() => {
    api
      .get(`/staff/trip-request/${id}`)
      .then((response) => setTrip(response.data.value))
      .catch((error) => console.error("Error fetching data:", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleBooking = () => {
    router.push(
      `/sale/custom/trip/booking?tripRequestId=${id}&tripBookingId=${trip?.tripBookingId}`
    );
  };
  if (!trip) return <p>Loading...</p>;

  return (
    <SaleStaffLayout title="Trip Request Detail">
      <Card title="Trip Request Details" bordered={false}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Number of Passengers">
            {trip.numberOfPassengers}
          </Descriptions.Item>
          <Descriptions.Item label="Nights">{trip.nights}</Descriptions.Item>
          <Descriptions.Item label="Departure Date">
            {trip.departureDate}
          </Descriptions.Item>
          <Descriptions.Item label="Departure Point">
            {trip.departurePoint}
          </Descriptions.Item>
          <Descriptions.Item label="Affordable Budget">
            {trip.affordableBudget.toLocaleString("en-US")} VND
          </Descriptions.Item>
          <Descriptions.Item label="Contact Name">
            {trip.nameContact}
          </Descriptions.Item>
          <Descriptions.Item label="Contact Email">
            {trip.emailContact}
          </Descriptions.Item>
          <Descriptions.Item label="Contact Phone">
            {trip.phoneContact}
          </Descriptions.Item>
          <Descriptions.Item label="Note">
            {trip.note || "No notes available"}
          </Descriptions.Item>
          <Descriptions.Item label="Koi Variety">
            {trip?.tripRequestVariety && trip.tripRequestVariety.length > 0 ? (
              trip.tripRequestVariety.map((item) => (
                <Tag color="blue" key={item.id}>
                  {item.koiName}
                </Tag>
              ))
            ) : (
              <span>No Koi Variety available</span>
            )}
          </Descriptions.Item>
        </Descriptions>
        <div className="mt-4 flex gap-4">
          <Button
            type="default"
            onClick={handleBooking}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Booking
          </Button>
          {trip.requestStatus === "Assigned" && (
            <Button
              type="default"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() =>
                router.push(`/sale/custom/trip/create?tripRequestId=${id}`)
              }
            >
              Handle
            </Button>
          )}
          <Button
            type="default"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() =>
              router.push(
                `/sale/custom/trip/${trip.customizedTripResponse.id}?requestId=${id}`
              )
            }
          >
            Trip
          </Button>
        </div>
      </Card>
    </SaleStaffLayout>
  );
};

export default TripRequestDetail;
