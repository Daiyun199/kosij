/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Card, Descriptions, Typography, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { TripBookingProps } from "@/model/TripBookingProps";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import { storage } from "@/config/firebase";
import api from "@/config/axios.config";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { Passenger } from "@/model/Passenger";

const { Title, Text } = Typography;
interface TripBookingInfoProps extends TripBookingProps {
  onUpdateTripBooking: (updatedTripBooking: any) => void;
  PassengerList: Passenger[];
}
const TripBookingInfo: React.FC<TripBookingInfoProps> = ({
  tripBooking,
  onUpdateTripBooking,
  PassengerList,
}) => {
  const atLeastOnePassengerHasVisa = PassengerList.some(
    (passenger) => passenger.hasVisa
  );
  const [outboundFile, setOutboundFile] = useState<File | null>(null);
  const [inboundFile, setInboundFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { role } = useParams();
  const isManager = role === "manager";
  const uploadFileToFirebase = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(storage, `trip-tickets/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Uploading: ${progress}%`);
        },
        (error) => {
          console.error("Error uploading:", error);
          setUploading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Image uploaded successfully:", downloadURL);
          resolve(downloadURL);
        }
      );
    });
  };

  const updateTripBooking = async (tripBookingId: string, data: any) => {
    try {
      await api.put(`/trip-booking/${tripBookingId}`, data);
      toast.success("Trip booking updated successfully!");
    } catch (error) {
      console.error("Failed to update trip booking:", error);
      toast.error("Failed to update trip booking.");
    }
  };

  const handleUpload = async () => {
    try {
      setUploading(true);

      if (tripBooking.tripBookingStatus === "Deposited") {
        const updatedTripBooking = {
          ...tripBooking,
          tripBookingStatus: "Processing",
        };

        await updateTripBooking(tripBooking.id, updatedTripBooking);
        onUpdateTripBooking(updatedTripBooking);
        toast.success("Trip booking status updated to Processing.");
        return;
      }

      if (tripBooking.tripBookingStatus === "Paid") {
        let outboundUrl = tripBooking.outboundTicketUrl;
        let inboundUrl = tripBooking.inboundTicketUrl;

        if (outboundFile) {
          outboundUrl = await uploadFileToFirebase(outboundFile);
        }
        if (inboundFile) {
          inboundUrl = await uploadFileToFirebase(inboundFile);
        }

        if (!outboundUrl || !inboundUrl) {
          toast.error(
            "Please upload both outbound and inbound tickets before updating."
          );
          return;
        }

        const allPassengersHaveVisa = PassengerList.every(
          (passenger) => passenger.hasVisa
        );

        const updatedTripBooking = {
          ...tripBooking,
          outboundTicketUrl: outboundUrl,
          inboundTicketUrl: inboundUrl,
          note: "Updated ticket images",
          tripBookingStatus: allPassengersHaveVisa
            ? "Processing"
            : tripBooking.tripBookingStatus,
        };

        await updateTripBooking(tripBooking.id, updatedTripBooking);
        onUpdateTripBooking(updatedTripBooking);
        toast.success("Trip booking updated successfully!");
      }
    } catch (error) {
      message.error("Failed to update trip booking.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mb-6 shadow-lg rounded-lg">
      <Title level={4} className="text-center mb-4">
        Trip Booking Details
      </Title>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Tour Name">
          <Text strong>{tripBooking.tourName}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Booking Time">
          {tripBooking.bookingTime}
        </Descriptions.Item>
        <Descriptions.Item label="Trip Type">
          {tripBooking.tripType}
        </Descriptions.Item>
        <Descriptions.Item label="Departure Date">
          {tripBooking.departureDate}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Text
            type={
              tripBooking.tripBookingStatus === "Cancelled"
                ? "danger"
                : "success"
            }
          >
            {tripBooking.tripBookingStatus}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Outbound Ticket">
          {tripBooking.outboundTicketUrl && (
            <Image
              src={tripBooking.outboundTicketUrl}
              alt="Outbound Ticket"
              width={150}
              height={150}
              className="mb-2 rounded-lg shadow-md object-contain"
            />
          )}
          {!isManager && tripBooking.tripBookingStatus === "Paid" && (
            <Upload
              beforeUpload={(file) => {
                setOutboundFile(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />} disabled={uploading}>
                Upload Outbound Ticket
              </Button>
            </Upload>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Inbound Ticket">
          {tripBooking.inboundTicketUrl && (
            <Image
              src={tripBooking.inboundTicketUrl}
              alt="Inbound Ticket"
              width={150}
              height={150}
              className="mb-2 rounded-lg shadow-md object-contain"
            />
          )}
          {!isManager && tripBooking.tripBookingStatus === "Paid" && (
            <Upload
              beforeUpload={(file) => {
                setInboundFile(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />} disabled={uploading}>
                Upload Inbound Ticket
              </Button>
            </Upload>
          )}
        </Descriptions.Item>
      </Descriptions>

      {!isManager &&
        (tripBooking.tripBookingStatus === "Deposited" ||
          tripBooking.tripBookingStatus === "Paid") &&
        atLeastOnePassengerHasVisa && (
          <Button
            type="primary"
            className="mt-4"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Update"}
          </Button>
        )}
    </Card>
  );
};

export default TripBookingInfo;
