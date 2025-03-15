"use client";

import {
  Button,
  Card,
  Descriptions,
  Divider,
  Table,
  Tag,
  Typography,
} from "antd";
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
          <Descriptions.Item label="Modified Note">
            {trip.modifiedNote || "No modified notes available"}
          </Descriptions.Item>
          <Descriptions.Item label="Feedback">
            {trip.feedback || "No feedback provided"}
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
      </Card>
      <Card title="Quotation Details" bordered={false} className="mt-4">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Total Amount Before Discount">
            {trip.quotationResponse?.totalAmountPreDiscount
              ? `${trip.quotationResponse.totalAmountPreDiscount.toLocaleString(
                  "en-US"
                )} VND`
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Discount Percentage">
            {trip.quotationResponse?.discountPercentage ?? "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Discount Amount">
            {trip.quotationResponse?.discountAmount
              ? `${trip.quotationResponse.discountAmount.toLocaleString(
                  "en-US"
                )} VND`
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Total Amount After Discount">
            {trip.quotationResponse?.totalAmountAfterDiscount
              ? `${trip.quotationResponse.totalAmountAfterDiscount.toLocaleString(
                  "en-US"
                )} VND`
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Visa Details">
            {trip.quotationResponse?.visaDetail?.quantity &&
            trip.quotationResponse?.visaDetail?.unitPrice
              ? `${
                  trip.quotationResponse.visaDetail.quantity
                } Visa(s) - ${trip.quotationResponse.visaDetail.unitPrice.toLocaleString(
                  "en-US"
                )} VND each`
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Grand Total Amount">
            {trip.quotationResponse?.grandTotalAmount
              ? `${trip.quotationResponse.grandTotalAmount.toLocaleString(
                  "en-US"
                )} VND`
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Typography.Title level={5}>Quotation Breakdown</Typography.Title>
        <Table
          dataSource={trip.quotationResponse?.quotationDetail ?? []}
          rowKey={(record) => record.ageGroup ?? Math.random().toString()}
          pagination={false}
        >
          <Table.Column title="Age Group" dataIndex="ageGroup" key="ageGroup" />
          <Table.Column title="Quantity" dataIndex="quantity" key="quantity" />
          <Table.Column
            title="Unit Price"
            dataIndex="unitPrice"
            key="unitPrice"
            render={(price) =>
              price ? `${price.toLocaleString("en-US")} VND` : "N/A"
            }
          />
          <Table.Column
            title="Total Amount"
            dataIndex="totalAmount"
            key="totalAmount"
            render={(amount) =>
              amount ? `${amount.toLocaleString("en-US")} VND` : "N/A"
            }
          />
        </Table>
      </Card>

      <div className="mt-4 flex gap-4">
        <Button
          type="default"
          onClick={handleBooking}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Booking
        </Button>
        {trip.requestStatus === "Assigned" && trip.tripBookingId && (
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
        {trip.customizedTripResponse?.id && (
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
        )}
      </div>
    </SaleStaffLayout>
  );
};

export default TripRequestDetail;
