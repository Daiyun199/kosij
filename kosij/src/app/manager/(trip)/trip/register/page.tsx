/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Input, Button, Form, Card, Typography, Spin } from "antd";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import api from "@/config/axios.config";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import ProtectedRoute from "@/app/ProtectedRoute";

function CreateTrip() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateTripPage />
    </Suspense>
  );
}

const { Title } = Typography;

const CreateTripPage: React.FC = () => {
  const searchParams = useSearchParams();
  const tourId = searchParams.get("tourId");

  const [tripData, setTripData] = useState({
    departureDate: "",
    minGroupSize: 1,
    maxGroupSize: 1,
    pricingRate: 1.0,
    tourId: tourId,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [registrationDaysBefore, setRegistrationDaysBefore] =
    useState<number>(0);

  const calculateMinDate = () => {
    const today = new Date();
    const daysToAdd =
      registrationDaysBefore == null ? 29 : registrationDaysBefore + 8;
    const minDate = new Date(today.setDate(today.getDate() + daysToAdd));
    return minDate.toISOString();
  };

  const validateDepartureDate = (_: any, value: string) => {
    const minDate = new Date(calculateMinDate());
    const selectedDate = new Date(value);
    if (selectedDate >= minDate) {
      return Promise.resolve();
    }

    const daysRequired =
      registrationDaysBefore == null ? 28 : registrationDaysBefore + 7;
    return Promise.reject(
      `Departure date must be at least ${daysRequired} days from today`
    );
  };

  useEffect(() => {
    if (registrationDaysBefore !== undefined) {
      setTripData((prev) => ({
        ...prev,
        departureDate: calculateMinDate(),
      }));
    }
  }, [registrationDaysBefore]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    if (!tourId) return;

    const fetchTourData = async () => {
      try {
        const response = await api.get(`/tour/${tourId}`);
        const data = response.data.value;
        setRegistrationDaysBefore(data.registrationDaysBefore);

        if (!data) throw new Error("No data returned from API");
      } catch (error) {
        console.error("Lỗi tải dữ liệu tour:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [tourId]);

  const handleChange = (name: string, value: any) => {
    if (name === "departureDate") {
      const date = new Date(value);
      value = date.toISOString();
    } else if (
      name === "minGroupSize" ||
      name === "maxGroupSize" ||
      name === "pricingRate"
    ) {
      value = Number(value);
    }

    setTripData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("trip/scheduled", tripData);
      console.log("Trip Created:", response.data);
      toast.success("Trip created successfully!");
      setErrors({});
      setTripData({
        departureDate: calculateMinDate(),
        minGroupSize: 1,
        maxGroupSize: 1,
        pricingRate: 1.0,
        tourId: tourId,
      });
    } catch (error: any) {
      console.error("Error creating trip:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error("Failed to create trip.");
      }
    }
  };

  const getInputDateValue = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerLayout title="Register Trip">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f0f2f5, #dfe6e9)",
            padding: "20px",
          }}
        >
          {loading ? (
            <Spin size="large" />
          ) : (
            <Card
              style={{
                maxWidth: 500,
                width: "100%",
                borderRadius: "15px",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              }}
              hoverable
            >
              <Title
                level={3}
                style={{ textAlign: "center", marginBottom: "20px" }}
              >
                Create Trip
              </Title>
              <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  label="Departure Date"
                  required
                  validateStatus={errors.DepartureDate ? "error" : ""}
                  help={errors.DepartureDate?.join(", ")}
                  rules={[
                    {
                      required: true,
                      message: "Please select departure date!",
                    },
                    { validator: validateDepartureDate },
                  ]}
                >
                  <Input
                    type="datetime-local"
                    min={getInputDateValue(calculateMinDate())}
                    value={getInputDateValue(tripData.departureDate)}
                    onChange={(e) =>
                      handleChange("departureDate", e.target.value)
                    }
                    required
                  />
                </Form.Item>

                <Form.Item
                  label="Minimum participants"
                  required
                  validateStatus={errors.MinGroupSize ? "error" : ""}
                  help={errors.MinGroupSize?.join(", ")}
                  rules={[
                    {
                      required: true,
                      message: "Please enter minimum group size!",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={1}
                    value={tripData.minGroupSize}
                    onChange={(e) =>
                      handleChange("minGroupSize", e.target.value)
                    }
                    required
                  />
                </Form.Item>

                <Form.Item
                  label="Maximum participants"
                  required
                  validateStatus={errors.MaxGroupSize ? "error" : ""}
                  help={errors.MaxGroupSize?.join(", ")}
                  rules={[
                    {
                      required: true,
                      message: "Please enter maximum group size!",
                      validator: (_, value) =>
                        value >= tripData.minGroupSize
                          ? Promise.resolve()
                          : Promise.reject(
                              "Max group size must be greater than or equal to min group size"
                            ),
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={tripData.minGroupSize + 1}
                    value={tripData.maxGroupSize}
                    onChange={(e) =>
                      handleChange("maxGroupSize", e.target.value)
                    }
                    required
                  />
                </Form.Item>

                <Form.Item
                  label="Pricing Rate"
                  required
                  validateStatus={errors.PricingRate ? "error" : ""}
                  help={errors.PricingRate?.join(", ")}
                  rules={[
                    {
                      required: true,
                      message: "Please enter pricing rate!",
                      type: "number",
                      min: 1,
                      max: 3,
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={1}
                    max={3}
                    step="0.1"
                    value={tripData.pricingRate}
                    onChange={(e) =>
                      handleChange("pricingRate", e.target.value)
                    }
                    required
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    style={{
                      borderRadius: "8px",
                      background: "#1890ff",
                      borderColor: "#1890ff",
                      transition: "background 0.3s ease, transform 0.2s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#40a9ff")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "#1890ff")
                    }
                  >
                    Create Trip
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
};

export default CreateTrip;
