/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Table,
  Button as AntButton,
  Modal,
  Popconfirm,
} from "antd";
import { Button } from "@/components/ui/button";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import api from "@/config/axios.config";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

interface Passenger {
  key: string;
  fullName: string;
  ageGroup: string;
  dateOfBirth: any;
  sex: string;
  nationality: string;
  email: string;
  phoneNumber: string;
  passport: string;
  isRepresentative: boolean;
  hasVisa: boolean;
}

export default function CreateTourStep0() {
  const [form] = Form.useForm();
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const searchParams = useSearchParams();
  const tripRequestId = searchParams.get("tripRequestId");
  const tripBookingId = searchParams.get("tripBookingId");
  const [tripBookingStatus, setTripBookingStatus] = useState();
  const [tripRequestStatus, setTripRequestStatus] = useState();
  const router = useRouter();
  useEffect(() => {
    const fetchPassengers = async () => {
      if (
        !tripBookingId ||
        tripBookingId === "null" ||
        tripBookingId === "undefined"
      ) {
        return;
      }

      try {
        const response = await api.get(
          `trip-booking/${tripBookingId}/passengers`
        );
        if (response.data?.value) {
          const fetchedPassengers = response.data.value.map((p: any) => ({
            key: String(p.id),
            fullName: p.fullName,
            ageGroup: p.ageGroup,
            dateOfBirth: p.dateOfBirth
              ? dayjs(p.dateOfBirth, "DD-MM-YYYY")
              : null,
            sex: p.sex,
            nationality: p.nationality,
            email: p.email,
            phoneNumber: p.phoneNumber,
            passport: p.passport,
            isRepresentative: p.isRepresentative,
            hasVisa: p.hasVisa,
          }));
          setPassengers(fetchedPassengers);
        }
        const responseTripBooking = await api.get(
          `trip-booking/${tripBookingId}`
        );

        if (responseTripBooking.data?.value) {
          setTripBookingStatus(
            responseTripBooking.data.value.tripBookingStatus
          );
        }
        const responseTripRequest = await api.get(
          `staff/trip-request/${tripRequestId}`
        );

        if (responseTripRequest.data?.value) {
          setTripRequestStatus(responseTripRequest.data.value.requestStatus);
        }
      } catch (error) {
        toast.error("There's are no passengers");
      }
    };
    fetchPassengers();
  }, []);

  const addPassenger = () => {
    const newPassenger: Passenger = {
      key: String(Date.now()),
      fullName: "",
      ageGroup: "",
      dateOfBirth: null,
      sex: "Male",
      nationality: "",
      email: "",
      phoneNumber: "",
      passport: "",
      isRepresentative: false,
      hasVisa: false,
    };
    setPassengers([...passengers, newPassenger]);
  };

  const removePassenger = (key: string) => {
    setPassengers(passengers.filter((p) => p.key !== key));
  };

  const updatePassenger = (index: number, field: string, value: any) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();

      if (passengers.length === 0) {
        toast.error("Please add at least one passenger.");
        return;
      }

      let hasAdult = false;
      let invalidAge = false;

      const formattedPassengers = passengers.map((p) => {
        if (!p.dateOfBirth) {
          invalidAge = true;
          return null;
        }

        const age = dayjs().year() - p.dateOfBirth.year();

        if (p.ageGroup === "Adult") {
          hasAdult = true;
          if (age < 18) {
            invalidAge = true;
          }
        } else if (p.ageGroup === "Child") {
          if (age < 2 || age > 11) {
            invalidAge = true;
          }
        } else if (p.ageGroup === "Infant") {
          if (age >= 2) {
            invalidAge = true;
          }
        }

        return {
          id: p.key.length > 10 ? null : p.key,
          fullName: p.fullName,
          ageGroup: p.ageGroup,
          dateOfBirth: {
            year: p.dateOfBirth.year(),
            month: p.dateOfBirth.month() + 1,
            day: p.dateOfBirth.date(),
            dayOfWeek: p.dateOfBirth.format("dddd"),
          },
          sex: p.sex,
          nationality: p.nationality,
          email: p.email,
          phoneNumber: p.phoneNumber,
          passport: p.passport,
          isRepresentative: p.isRepresentative,
          hasVisa: p.hasVisa,
        };
      });

      if (!hasAdult) {
        toast.error("At least one passenger must be an adult (18+ years old).");
        return;
      }

      if (invalidAge) {
        toast.error("Please check the age requirements for each age group.");
        return;
      }

      const payload = {
        passengerDetailsRequests: formattedPassengers,
        note: form.getFieldValue("note"),
      };

      if (
        !tripBookingId ||
        tripBookingId === "null" ||
        tripBookingId === "undefined"
      ) {
        payload.passengerDetailsRequests = JSON.parse(
          JSON.stringify(payload.passengerDetailsRequests, (key, value) =>
            key === "id" ? undefined : value
          )
        );
        await api.post("/trip-booking/customized", {
          tripRequestId,
          ...payload,
        });
      } else {
        delete payload.note;
        await api.put(`/trip-booking/${tripBookingId}/passengers`, payload);
      }

      toast.success("Trip booking submitted successfully!");
      router.push(`/sale/requests/${tripRequestId}`);
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.value || "Failed to submit trip booking.";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to submit trip booking.");
      }
    }
  };
  const isEditable =
    (tripBookingStatus === "Drafted" ||
      tripBookingStatus === null ||
      tripBookingStatus === undefined) &&
    tripRequestStatus !== "Processing";
  const columns: ColumnsType<Passenger> = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      render: (_, record, index) => (
        <Input
          value={record.fullName}
          onChange={(e) => updatePassenger(index, "fullName", e.target.value)}
          disabled={!isEditable}
        />
      ),
    },
    {
      title: "Age Group",
      dataIndex: "ageGroup",
      render: (_, record, index) => (
        <Select
          value={record.ageGroup}
          onChange={(value) => updatePassenger(index, "ageGroup", value)}
          options={[
            { label: "Adult", value: "Adult" },
            { label: "Child", value: "Child" },
            { label: "Infant", value: "Infant" },
          ]}
          style={{ width: 120 }}
          disabled={!isEditable}
        />
      ),
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      render: (_, record, index) => (
        <DatePicker
          value={record.dateOfBirth}
          onChange={(date) => updatePassenger(index, "dateOfBirth", date)}
          disabled={!isEditable}
        />
      ),
    },
    {
      title: "Gender",
      dataIndex: "sex",
      render: (_, record, index) => (
        <Select
          value={record.sex}
          onChange={(value) => updatePassenger(index, "sex", value)}
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
          ]}
          disabled={!isEditable}
        />
      ),
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      render: (_, record, index) => (
        <Input
          value={record.nationality}
          onChange={(e) =>
            updatePassenger(index, "nationality", e.target.value)
          }
          disabled={!isEditable}
        />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
      render: (_, record, index) => (
        <Form.Item
          name={["passengers", index, "email"]}
          rules={[
            { required: true, message: "Email is required!" },
            { type: "email", message: "Invalid email format!" },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input
            value={record.email}
            onChange={(e) => updatePassenger(index, "email", e.target.value)}
            disabled={!isEditable}
          />
        </Form.Item>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      width: 180,
      render: (_, record, index) => (
        <Form.Item
          name={["passengers", index, "phoneNumber"]}
          rules={[
            { required: true, message: "Phone number is required!" },
            { pattern: /^[0-9]{8,15}$/, message: "Must be 8-15 digits!" },
          ]}
          validateTrigger="onBlur"
          style={{ marginBottom: 0 }}
        >
          <Input
            value={record.phoneNumber}
            onChange={(e) =>
              updatePassenger(index, "phoneNumber", e.target.value)
            }
            disabled={!isEditable}
          />
        </Form.Item>
      ),
    },
    {
      title: "Passport",
      dataIndex: "passport",
      render: (_, record, index) => (
        <Input
          value={record.passport}
          onChange={(e) => updatePassenger(index, "passport", e.target.value)}
          disabled={!isEditable}
        />
      ),
    },
    {
      title: "Representative",
      dataIndex: "isRepresentative",
      render: (_, record, index) => (
        <Input
          type="checkbox"
          checked={record.isRepresentative}
          onChange={(e) =>
            updatePassenger(index, "isRepresentative", e.target.checked)
          }
          disabled={!isEditable}
        />
      ),
    },
    {
      title: "Has Visa",
      dataIndex: "hasVisa",
      render: (_, record, index) => (
        <Input
          type="checkbox"
          checked={record.hasVisa}
          onChange={(e) => updatePassenger(index, "hasVisa", e.target.checked)}
          disabled={!isEditable}
        />
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) =>
        isEditable ? (
          <Popconfirm
            title="Are you sure to delete this passenger?"
            onConfirm={() => removePassenger(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <AntButton
              type="primary"
              danger
              icon={
                <DeleteOutlined
                  style={{
                    color: "red",
                    background: "white",
                    padding: 4,
                    borderRadius: "50%",
                  }}
                />
              }
            />
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <SaleStaffLayout title="Trip Custom">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Trip Booking</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="note" label="Notes">
            <Input.TextArea placeholder="Enter notes" disabled={!isEditable} />
          </Form.Item>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Passenger Information</h3>
            <Button
              onClick={addPassenger}
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!isEditable}
            >
              <PlusOutlined /> Add Passenger
            </Button>
          </div>

          <Table columns={columns} dataSource={passengers} pagination={false} />

          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white"
              onClick={() => router.push(`/sale/requests/${tripRequestId}`)}
            >
              Go to Request
            </Button>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={!isEditable}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </SaleStaffLayout>
  );
}
