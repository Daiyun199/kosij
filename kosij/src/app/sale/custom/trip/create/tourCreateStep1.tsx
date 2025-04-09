/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  DatePicker,
} from "antd";
import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { toast } from "react-toastify";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";
import dayjs from "dayjs";
import api from "@/config/axios.config";
import { useRouter } from "next/navigation";

interface Step1Props {
  onNext: () => void;
  tripRequestId?: any;

  data: {
    tourName?: string;
    night?: number;
    day?: number;
    departure?: string;
    destination?: string;
    departureDate?: string;

    standardPrice?: number;
    visaFee?: number;
    img?: File | null;
  };
  updateData: (data: object) => void;
}

export default function CreateTripStep1({
  onNext,
  data,
  updateData,
  tripRequestId,
}: Step1Props) {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [img, setImg] = useState<File | null>(data.img || null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tripRequestId) {
          const response = await api.get(
            `/staff/trip-request/${tripRequestId}`
          );
          const apiData = response.data.value;
          console.log(apiData);
          const initialValues = {
            ...data,
            night: apiData.nights || data.night || 1,
            day: (apiData.nights || data.night || 1) + 1,
            departureDate: data.departureDate
              ? dayjs(
                  data.departureDate,
                  data.departureDate.includes("-")
                    ? "YYYY-MM-DD"
                    : "DD-MM-YYYY HH:mm:ss"
                )
              : apiData.departureDate
              ? dayjs(apiData.departureDate, "DD-MM-YYYY HH:mm:ss")
              : undefined,
            departure: apiData.departurePoint || data.departure,
            destination: apiData.destination || data.destination,
            tourName: apiData.tourName || data.tourName,
          };

          form.setFieldsValue(initialValues);
        } else {
          const initialValues = {
            ...data,
            night: data.night || 1,
            day: (data.night || 1) + 1,
          };
          form.setFieldsValue(initialValues);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [tripRequestId, data, form]);

  const handleNightChange = (value: number | null) => {
    const nights = value ?? 1;
    form.setFieldsValue({
      night: nights,
      day: nights + 1,
    });
  };

  const handleNext = () => {
    if (!img) {
      toast.error("Please upload an image!");
      return;
    }
    form.validateFields().then((values) => {
      const newData = {
        ...values,
        img,
        departureDate: values.departureDate?.format("YYYY-MM-DD"),
      };
      updateData(newData);
      onNext();
    });
  };

  const handleUpload = (file: File) => {
    setImg(file);
    return false;
  };

  const currencyFormatter = (value?: number | string): string => {
    if (typeof value === "number") {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return value ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
  };

  const currencyParser = (displayValue?: string): number => {
    return Number(displayValue?.replace(/,/g, "") || "0");
  };

  if (loading) {
    return (
      <SaleStaffLayout title="Tour Create">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </SaleStaffLayout>
    );
  }

  return (
    <SaleStaffLayout title="Tour Create">
      <div className="flex justify-center p-6">
        <Card className="p-6 w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-4">
            TRIP INFORMATION FORM
          </h2>
          <Form layout="vertical" form={form}>
            <Form.Item
              label="Tour Name:"
              name="tourName"
              rules={[
                { required: true, message: "Please input the Tour name!!!" },
              ]}
            >
              <Input placeholder="Enter tour name" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Nights:"
                name="night"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={1}
                  className="w-full"
                  onChange={handleNightChange}
                />
              </Form.Item>
              <Form.Item label="Days (Auto):" name="day">
                <InputNumber className="w-full" readOnly disabled />
              </Form.Item>
            </div>

            <Form.Item
              label="Departure Points:"
              name="departure"
              rules={[
                {
                  required: true,
                  message: "Please select the Departure Point!!!",
                },
              ]}
            >
              <Select placeholder="Select departure point">
                <Select.Option value="Tân Sơn Nhất (TP Hồ Chí Minh)">
                  Tan Son Nhat (Ho Chi Minh City)
                </Select.Option>
                <Select.Option value="Nội Bài (Hà Nội)">
                  Noi Bai (Ha Noi)
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Destination Points:"
              name="destination"
              rules={[
                {
                  required: true,
                  message: "Please input the Destination Points!!!",
                },
              ]}
            >
              <Input placeholder="Enter destination points" />
            </Form.Item>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Departure Date:"
                name="departureDate"
                rules={[
                  {
                    required: true,
                    message: "Please select the Departure Date!!!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const today = dayjs().startOf("day");
                      const minDate = today.add(22, "day");
                      if (!value || value >= minDate) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "Departure date must be at least 21 days from today!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  placeholder="Select departure date"
                  disabledDate={(current) => {
                    const today = dayjs().startOf("day");
                    const minDate = today.add(22, "day");
                    return current && current < minDate;
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Pricing Rate"
                name="pricingRate"
                rules={[
                  { required: true, message: "Please enter a pricing rate!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || (value >= 1 && value <= 3)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Pricing rate must be between 1 and 3!")
                      );
                    },
                  }),
                ]}
              >
                <div className="w-full">
                  <InputNumber className="w-full" min={1} max={3} step={0.1} />
                </div>
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Standard Price (VND):" name="standardPrice">
                <InputNumber
                  min={0}
                  className="w-full"
                  formatter={(value) => currencyFormatter(value as number)}
                  parser={currencyParser}
                />
              </Form.Item>

              <Form.Item label="Visa Fee (VND):" name="visaFee">
                <InputNumber
                  min={0}
                  className="w-full"
                  formatter={(value) => currencyFormatter(value as number)}
                  parser={currencyParser}
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Upload Tour Image:"
              rules={[{ required: true, message: "Please upload an image!" }]}
            >
              <Upload
                beforeUpload={handleUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
              {!img && (
                <p className="text-red-500 mt-2">Please upload an image!</p>
              )}
              {img && (
                <Image
                  src={URL.createObjectURL(img)}
                  alt="Tour"
                  width={300}
                  height={200}
                  className="mt-2 rounded-lg"
                />
              )}
            </Form.Item>

            <div className="flex justify-between">
              <Button
                onClick={() => router.push(`/sale/requests/${tripRequestId}`)}
              >
                Back
              </Button>
              <Button type="primary" onClick={handleNext}>
                Next ➜
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </SaleStaffLayout>
  );
}
