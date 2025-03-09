"use client";

import { Card, Descriptions, Tag } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/config/axios.config";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";

type KoiVariety = {
  id: string;
  Name: string;
};

type TripRequest = {
  NumberOfPassengers: number;
  Nights: number;
  DepartureDate: string;
  DeparturePoint: string;
  AffordableBudget: number;
  NameContact: string;
  EmailContact: string;
  PhoneContact: string;
  Note: string;
  ListKoiVarietyRequests: KoiVariety[];
};

const TripRequestDetail = () => {
  const [trip, setTrip] = useState<TripRequest | null>(null);
  const params = useParams() as { id: string };

  const id = params.id;
  useEffect(() => {
    api
      .get(`/staff/trip-request/${id}`)
      .then((response) => setTrip(response.data))
      .catch((error) => console.error("Error fetching data:", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!trip) return <p>Loading...</p>;

  return (
    <SaleStaffLayout title="Trip Request Detail">
      <Card title="Trip Request Details" bordered={false}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Number of Passengers">
            {trip.NumberOfPassengers}
          </Descriptions.Item>
          <Descriptions.Item label="Nights">{trip.Nights}</Descriptions.Item>
          <Descriptions.Item label="Departure Date">
            {trip.DepartureDate}
          </Descriptions.Item>
          <Descriptions.Item label="Departure Point">
            {trip.DeparturePoint}
          </Descriptions.Item>
          <Descriptions.Item label="Affordable Budget">
            {trip.AffordableBudget} VND
          </Descriptions.Item>
          <Descriptions.Item label="Contact Name">
            {trip.NameContact}
          </Descriptions.Item>
          <Descriptions.Item label="Contact Email">
            {trip.EmailContact}
          </Descriptions.Item>
          <Descriptions.Item label="Contact Phone">
            {trip.PhoneContact}
          </Descriptions.Item>
          <Descriptions.Item label="Note">
            {trip.Note || "No notes available"}
          </Descriptions.Item>
          <Descriptions.Item label="Koi Variety">
            {trip?.ListKoiVarietyRequests &&
            trip.ListKoiVarietyRequests.length > 0 ? (
              trip.ListKoiVarietyRequests.map((item) => (
                <Tag color="blue" key={item.id}>
                  {item.Name}
                </Tag>
              ))
            ) : (
              <span>No Koi Variety available</span>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </SaleStaffLayout>
  );
};

export default TripRequestDetail;
