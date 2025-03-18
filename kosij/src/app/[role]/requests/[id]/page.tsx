/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Button,
  Card,
  Descriptions,
  Divider,
  Input,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/config/axios.config";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import { TripRequestScpeacial } from "@/model/TripRequestSpeacial";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { toast } from "react-toastify";

const TripRequestDetail = () => {
  const [trip, setTrip] = useState<TripRequestScpeacial | null>(null);
  const params = useParams() as { id: string };
  const router = useRouter();
  const id = params.id;
  const { role } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [actionType, setActionType] = useState<"Approve" | "Deny" | null>(null);

  const handleOpenModal = (type: "Approve" | "Deny") => {
    setActionType(type);
    setIsModalOpen(true);
    console.log("Opened modal with actionType:", type);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDescription("");
    setActionType(null);
  };

  const LayoutComponent = role === "manager" ? ManagerLayout : SaleStaffLayout;
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
  const handleSubmit = async () => {
    if (!actionType) return;
    const tripStatus =
      actionType === "Approve" ? "Approved" : "ManagerRejected";

    try {
      await api.put(`/manager/trip-request/${id}`, {
        requestStatus: tripStatus,
        feedback: description,
      });

      toast.success(`Trip request ${actionType.toLowerCase()} successfully!`);
      if (actionType === "Approve") {
        router.push(
          `/manager/selectStaff?tripId=${
            trip.customizedTripResponse.id
          }&consultant=${true}`
        );
      } else {
        router.push(`/manager/requests/processing`);
      }
      handleCloseModal();
    } catch (error: any) {
      console.error(
        `Error ${actionType.toLowerCase()}ing trip request:`,
        error
      );

      const errorMessage =
        error.response?.data?.value ||
        `Failed to ${actionType.toLowerCase()} trip request.`;

      toast.error(errorMessage);
    }
  };

  return (
    <LayoutComponent title="Trip Request Detail">
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
        {role === "sale" && (
          <Button
            type="default"
            onClick={handleBooking}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Booking
          </Button>
        )}
        {role === "sale" &&
          trip.requestStatus === "Assigned" &&
          trip.tripBookingId && (
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
                `/${role}/custom/trip/${trip.customizedTripResponse.id}?requestId=${id}`
              )
            }
          >
            Trip
          </Button>
        )}
        {role === "manager" && trip.requestStatus === "Processing" && (
          <>
            <Button
              type="default"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => handleOpenModal("Approve")}
            >
              Approve
            </Button>
            <Button
              type="default"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => handleOpenModal("Deny")}
            >
              Deny
            </Button>
          </>
        )}
        <Modal
          title={`${actionType || "Approve"} Trip Request`}
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={[
            <Button key="cancel" onClick={handleCloseModal}>
              Cancel
            </Button>,
            <Popconfirm
              key="confirm"
              title="Are you sure?"
              description="Do you really want to proceed with this action?"
              onConfirm={handleSubmit}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">{actionType}</Button>
            </Popconfirm>,
          ]}
        >
          <Input.TextArea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter feedback description"
          />
        </Modal>
        ;
      </div>
    </LayoutComponent>
  );
};

export default TripRequestDetail;
