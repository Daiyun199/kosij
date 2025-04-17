/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import PassengerList from "@/app/components/PassenegerList/PassenegerList";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import TripBookingInfo from "@/app/components/TripBookingInfo/TripBookingInfo";
import { EyeOutlined } from "@ant-design/icons";
import api from "@/config/axios.config";
import { Passenger } from "@/model/Passenger";
import { Button, Card, Collapse, Empty } from "antd";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProtectedRoute from "@/app/ProtectedRoute";

const { Panel } = Collapse;
function Page() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const id = params.id;
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const { role } = useParams();
  const LayoutComponent = role === "manager" ? ManagerLayout : SaleStaffLayout;
  const [passengerData, setPassengerData] = useState<Passenger[]>([]);
  const [originalPassengerData, setOriginalPassengerData] = useState<
    Passenger[]
  >([]);
  const tripRequestId = searchParams.get("requestId");
  const [loading, setLoading] = useState(true);
  const [tripBooking, setTripBooking] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const custom = searchParams.get("custom") === "true";

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const tripBookingResponse = await api.get(`/trip-booking/${id}`);
        const tripBookingData = tripBookingResponse.data.value;

        setTripBooking({ ...tripBookingData, id });
        const passengerResponses = await api.get(
          `/trip-booking/${id}/passengers`
        );

        const passengers = passengerResponses.data.value.map(
          (passenger: Passenger) => ({
            ...passenger,
            tripBookingId: id,
            tripBookingStatus: tripBookingData.tripBookingStatus,
          })
        );
        setPassengerData(passengers);
        setOriginalPassengerData(passengers);
        if (role === "manager") {
          const ordersResponse = await api.get(`/trip-booking/${id}/orders`);
          setOrders(ordersResponse.data.value);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleViewMore = (orderId: string) => {
    router.push(`/${role}/orders/${orderId}`);
  };

  const handleUpdatePassenger = (updatedPassenger: Passenger) => {
    setPassengerData((prevPassengers) =>
      prevPassengers.map((p) =>
        p.id === updatedPassenger.id ? updatedPassenger : p
      )
    );
  };

  const handleBack = () => {
    router.push(`/${role}/custom/trip/${tripId}?requestId=${tripRequestId}`);
  };

  const handleSelectStaff = () => {
    router.push(`/manager/selectStaff?tripId=${id}`);
  };

  const handleUpdateTripBooking = (updatedTripBooking: any) => {
    setTripBooking(updatedTripBooking);
  };
  const handleSaveChanges = async () => {
    try {
      const modifiedPassengers = passengerData.filter((passenger, index) => {
        const originalPassenger = originalPassengerData.find(
          (p) => p.id === passenger.id
        );
        return (
          originalPassenger && passenger.hasVisa !== originalPassenger.hasVisa
        );
      });

      if (modifiedPassengers.length === 0) {
        return;
      }

      for (const passenger of modifiedPassengers) {
        await api.put(
          `/trip-booking/${passenger.tripBookingId}/passenger/${passenger.id}/has-visa?hasVisa=${passenger.hasVisa}`,
          { hasVisa: passenger.hasVisa }
        );
      }

      setOriginalPassengerData(passengerData);
      toast.success("Passenger visa statuses updated successfully!");
    } catch (error) {
      console.error("Error updating passenger visa statuses:", error);
      toast.error("Failed to update passenger visa statuses.");
    }
  };

  if (loading) return;
  <ProtectedRoute allowedRoles={["manager", "salesstaff"]}>
    <p>Loading...</p>
  </ProtectedRoute>;

  return (
    <ProtectedRoute allowedRoles={["manager", "salesstaff"]}>
      <LayoutComponent title="Passenger List">
        <div className="p-6 max-w-5xl mx-auto">
          {tripBooking && (
            <TripBookingInfo
              tripBooking={tripBooking}
              onUpdateTripBooking={handleUpdateTripBooking}
              PassengerList={passengerData}
              onSaveChanges={handleSaveChanges}
            />
          )}

          {passengerData.length ? (
            <PassengerList
              passengers={passengerData}
              onUpdatePassenger={handleUpdatePassenger}
              tripBookingStatus={tripBooking?.tripBookingStatus}
              role={Array.isArray(role) ? role[0] : role || ""}
            />
          ) : (
            <Card className="flex justify-center items-center h-40">
              <Empty description="No passengers found" />
            </Card>
          )}
          {custom && (
            <div className="mt-4">
              <Button type="primary" onClick={handleBack}>
                Back
              </Button>
            </div>
          )}
          {role === "manager" && orders.length ? (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Order List</h2>
              <Collapse accordion>
                {orders.map((order) => (
                  <Panel
                    header={
                      <span className="font-semibold">{order.fullName}</span>
                    }
                    key={order.id}
                  >
                    <Card className="mb-4">
                      <p>
                        <strong>Phone:</strong> {order.phoneNumber}
                      </p>
                      <p>
                        <strong>Delivery Address:</strong>{" "}
                        {order.deliveryAddress}
                      </p>
                      <p>
                        <strong>Farm Name:</strong> {order.farmName}
                      </p>
                      <p>
                        <strong>Total Amount:</strong>{" "}
                        {order.totalAmount
                          ? order.totalAmount.toLocaleString()
                          : "N/A"}{" "}
                        VND
                      </p>
                      <p>
                        <strong>Paid:</strong>{" "}
                        {order.paidAmount
                          ? order.paidAmount.toLocaleString()
                          : "N/A"}{" "}
                        VND
                      </p>
                      <p>
                        <strong>Remaining:</strong>{" "}
                        {order.remaining
                          ? order.remaining.toLocaleString()
                          : "N/A"}{" "}
                        VND
                      </p>
                      <p>
                        <strong>Order Status:</strong> {order.orderStatus}
                      </p>
                      {order.cancellationReason && (
                        <p>
                          <strong>Cancellation Reason:</strong>{" "}
                          {order.cancellationReason}
                        </p>
                      )}
                      <p>
                        <strong> Estimated Delivery Date:</strong>{" "}
                        {order.expectedDeliveryDate}
                      </p>
                      <Button
                        type="default"
                        shape="round"
                        icon={<EyeOutlined />}
                        onClick={() => {
                          handleViewMore(order.orderId);
                        }}
                        className="mt-2 px-4 shadow-sm hover:bg-gray-100"
                      >
                        View More
                      </Button>
                    </Card>
                  </Panel>
                ))}
              </Collapse>
            </div>
          ) : (
            <div className="mt-6">
              <Card className="flex justify-center items-center h-40">
                <Empty description="No orders found" />
              </Card>
            </div>
          )}
        </div>
      </LayoutComponent>
    </ProtectedRoute>
  );
}

export default Page;
