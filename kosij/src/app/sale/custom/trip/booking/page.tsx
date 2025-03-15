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
      console.log("Passengers before formatting:", passengers);
      const formattedPassengers = passengers.map((p) => {
        const isNewPassenger = !p.key || p.key.length > 10;

        const passengerData: any = {
          id: isNewPassenger ? null : p.key,
          fullName: p.fullName,
          ageGroup: p.ageGroup,
          dateOfBirth: p.dateOfBirth
            ? {
                year: p.dateOfBirth.year(),
                month: p.dateOfBirth.month() + 1,
                day: p.dateOfBirth.date(),
                dayOfWeek: p.dateOfBirth.format("dddd"),
              }
            : null,
          sex: p.sex,
          nationality: p.nationality,
          email: p.email,
          phoneNumber: p.phoneNumber,
          passport: p.passport,
          isRepresentative: p.isRepresentative,
          hasVisa: p.hasVisa,
        };

        return passengerData;
      });

      const payload = {
        passengerDetailsRequests: formattedPassengers,
        note: form.getFieldValue("note"),
      };

      if (
        !tripBookingId ||
        tripBookingId === "null" ||
        tripBookingId === "undefined"
      ) {
        payload.passengerDetailsRequests.forEach((p) => delete p.id);
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

  const columns: ColumnsType<Passenger> = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      render: (_, record, index) => (
        <Input
          value={record.fullName}
          onChange={(e) => updatePassenger(index, "fullName", e.target.value)}
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
        />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (_, record, index) => (
        <Input
          value={record.email}
          onChange={(e) => updatePassenger(index, "email", e.target.value)}
        />
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      render: (_, record, index) => (
        <Input
          value={record.phoneNumber}
          onChange={(e) =>
            updatePassenger(index, "phoneNumber", e.target.value)
          }
        />
      ),
    },
    {
      title: "Passport",
      dataIndex: "passport",
      render: (_, record, index) => (
        <Input
          value={record.passport}
          onChange={(e) => updatePassenger(index, "passport", e.target.value)}
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
        />
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
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
      ),
    },
  ];

  return (
    <SaleStaffLayout title="Trip Custom">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Trip Booking</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="note" label="Notes">
            <Input.TextArea placeholder="Enter notes" />
          </Form.Item>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Passenger Information</h3>
            <Button
              onClick={addPassenger}
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white"
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
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </SaleStaffLayout>
  );
}
