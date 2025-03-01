"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, Form, Card, Typography, Spin } from "antd";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import api from "@/config/axios.config";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const { Title } = Typography;

const CreateTripPage: React.FC = () => {
  const searchParams = useSearchParams();
  const tourId = searchParams.get("tourId");
  const initialTripData = {
    tripType: "Scheduled",
    departureDate: "",
    minGroupSize: 1,
    maxGroupSize: 1,
    pricingRate: 0,
    tourId: tourId,
  };
  const [tripData, setTripData] = useState(initialTripData);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (name: string, value: any) => {
    setTripData((prev) => ({
      ...prev,
      [name]:
        name === "minGroupSize" ||
        name === "maxGroupSize" ||
        name === "pricingRate"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("trip", tripData);
      console.log("Trip Created:", response.data);
      toast.success("Trip created successfully!");
      setErrors({});
      setTripData(initialTripData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error creating trip:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error("Failed to create trip.");
      }
    }
  };

  return (
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
              >
                <Input
                  type="datetime-local"
                  min={new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .slice(0, 16)}
                  value={tripData.departureDate}
                  onChange={(e) =>
                    handleChange("departureDate", e.target.value)
                  }
                />
              </Form.Item>

              <Form.Item
                label="Minimum participants"
                required
                validateStatus={errors.MinGroupSize ? "error" : ""}
                help={errors.MinGroupSize?.join(", ")}
              >
                <Input
                  type="number"
                  min={1}
                  value={tripData.minGroupSize}
                  onChange={(e) => handleChange("minGroupSize", e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Maximum participants"
                required
                validateStatus={errors.MaxGroupSize ? "error" : ""}
                help={errors.MaxGroupSize?.join(", ")}
              >
                <Input
                  type="number"
                  min={1}
                  value={tripData.maxGroupSize}
                  onChange={(e) => handleChange("maxGroupSize", e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Pricing Rate"
                required
                validateStatus={errors.PricingRate ? "error" : ""}
                help={errors.PricingRate?.join(", ")}
              >
                <Input
                  type="number"
                  min={1}
                  max={3}
                  step="0.1"
                  value={tripData.pricingRate}
                  onChange={(e) => handleChange("pricingRate", e.target.value)}
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
  );
};

export default CreateTripPage;
