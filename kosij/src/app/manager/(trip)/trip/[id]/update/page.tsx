/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/config/axios.config";
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Card,
  Spin,
  Space,
  Descriptions,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import { toast } from "react-toastify";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";

interface TourData {
  departureDate: Date | string;
  maxGroupSize: number;
  minGroupSize: number;
  pricingRate: number;
  standardPrice: number;
  registrationDaysBefore: number;
}

interface CurrentData {
  standardPrice: number;
  maxGroupSize: number;
  minGroupSize: number;
  pricingRate: number;
  totalPassengers?: number;
  registrationDaysBefore: number;
}

export default function UpdateTourPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<TourData>({
    departureDate: "2025-04-02T13:30:32.374Z",
    maxGroupSize: 0,
    minGroupSize: 0,
    pricingRate: 0,
    standardPrice: 0,
    registrationDaysBefore: 0,
  });
  const parseCustomDate = (dateString: string) => {
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}`);
  };
  const [currentData, setCurrentData] = useState<CurrentData>({
    standardPrice: 0,
    maxGroupSize: 0,
    minGroupSize: 0,
    pricingRate: 0,
    totalPassengers: 0,
    registrationDaysBefore: 0,
  });
  const params = useParams() as { id: string };
  const id = params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tourResponse = await api.get(`staff/trip/${id}`);
        const tourData = tourResponse.data.value;

        const passengersResponse = await api.get(`trip/${id}/total-passengers`);
        const passengersData = passengersResponse.data.value;
        const totalPassengers = passengersData?.totalPassengers || 0;

        setInitialValues(tourData);
        setCurrentData({
          standardPrice: tourData.standardPrice,
          maxGroupSize: tourData.maxGroupSize,
          minGroupSize: tourData.minGroupSize,
          pricingRate: tourData.pricingRate,
          totalPassengers,
          registrationDaysBefore: tourData.tourResponse.registrationDaysBefore,
        });
        const departureDate = tourData.departureDate
          ? dayjs(parseCustomDate(tourData.departureDate))
          : null;

        form.setFieldsValue({
          ...tourData,
          departureDate: departureDate,
        });
        form.setFieldsValue({
          ...tourData,
          departureDate: departureDate,
        });
      } catch (error) {
        toast.error("Failed to load tour data");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [form, id]);
  const calculateMinDepartureDate = () => {
    const today = dayjs().startOf("day");
    const minDate = today.add(currentData.registrationDaysBefore + 7, "day");
    return minDate;
  };
  const onFinish = async (values: TourData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        ...values,
        departureDate: hasPassengers
          ? null
          : dayjs(values.departureDate).format("YYYY-MM-DDTHH:mm:ss") + "Z",
      };

      const response = await api.put(`/trip/${id}/scheduled`, payload);
      toast.success("Update successful!");
      console.log("Update response:", response.data);

      const updatedResponse = await api.get(`staff/trip/${id}`);
      const updatedData = updatedResponse.data.value;
      setCurrentData((prev) => ({
        ...prev,
        maxGroupSize: updatedData.maxGroupSize,
        minGroupSize: updatedData.minGroupSize,
        pricingRate: updatedData.pricingRate,
      }));
      router.back();
    } catch (error) {
      toast.error("Error updating tour data");
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
    toast.error("Please fill all required fields correctly");
  };

  const hasPassengers = (currentData.totalPassengers || 0) > 0;
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    );
  }

  return (
    <ManagerLayout title="Update Trip">
      <div className="container mx-auto p-4 max-w-2xl">
        <Card
          title={
            <h1 className="text-2xl font-bold">Update Trip Information</h1>
          }
          bordered={false}
          className="shadow-lg"
        >
          <Form
            form={form}
            name="updateTour"
            initialValues={initialValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            size="large"
          >
            {!hasPassengers && (
              <Form.Item
                label="Departure Date"
                name="departureDate"
                rules={[
                  { required: true, message: "Please select departure date!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const minDate = calculateMinDepartureDate();
                      if (!value || value.isAfter(minDate.subtract(1, "day"))) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          `Departure date must be at least ${minDate.format(
                            "YYYY-MM-DD"
                          )}`
                        )
                      );
                    },
                  }),
                ]}
              >
                <DatePicker
                  disabledDate={(current) => {
                    const minDate = calculateMinDepartureDate();
                    return current && current < minDate.startOf("day");
                  }}
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  className="w-full"
                  getPopupContainer={(trigger) => trigger.parentElement!}
                />
              </Form.Item>
            )}
            <Form.Item
              label="Minimum Group Size"
              name="minGroupSize"
              rules={[
                { required: true, message: "Please input minimum group size!" },
                {
                  type: "number",
                  min: currentData.totalPassengers || 0,
                  message: `Minimum group size must be at least ${
                    currentData.totalPassengers || 0
                  }`,
                },
              ]}
            >
              <InputNumber
                min={currentData.totalPassengers || 0}
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              label="Maximum Group Size"
              name="maxGroupSize"
              dependencies={["minGroupSize"]}
              rules={[
                { required: true, message: "Please input maximum group size!" },
                {
                  type: "number",
                  min: (currentData.totalPassengers || 0) + 1,
                  message: `Maximum group size must be at least ${
                    (currentData.totalPassengers || 0) + 1
                  }`,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const minSize = getFieldValue("minGroupSize") || 0;
                    if (!value || value >= minSize + 1) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        `Maximum must be at least ${minSize + 1} (minimum + 1)`
                      )
                    );
                  },
                }),
              ]}
            >
              <InputNumber
                min={(currentData.totalPassengers || 0) + 1}
                className="w-full"
              />
            </Form.Item>

            {!hasPassengers && (
              <Form.Item
                label="Pricing Rate"
                name="pricingRate"
                rules={[
                  { required: true, message: "Please input pricing rate!" },
                ]}
              >
                <InputNumber min={1} max={3} step={0.1} className="w-full" />
              </Form.Item>
            )}

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  size="large"
                >
                  Update
                </Button>
                <Button
                  type="default"
                  size="large"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <Card title="Current Data" className="mt-6" size="small">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Standard Price">
                {currentData.standardPrice.toLocaleString()} VND
              </Descriptions.Item>
              <Descriptions.Item label="Minimum Group Size">
                {currentData.minGroupSize}
              </Descriptions.Item>
              <Descriptions.Item label="Maximum Group Size">
                {currentData.maxGroupSize}
              </Descriptions.Item>
              <Descriptions.Item label="Current Passengers">
                {currentData.totalPassengers}
              </Descriptions.Item>
              <Descriptions.Item label="Pricing Rate">
                {currentData.pricingRate}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Card>
      </div>
    </ManagerLayout>
  );
}
