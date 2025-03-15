"use client";
import React, { useState, useEffect } from "react";

import { CreateTourStep3Props } from "@/model/CreateTourStep3Props";
import { FiArrowLeft, FiTrash } from "react-icons/fi";
import api from "@/config/axios.config";

import { Button, Input } from "antd";
import { Card } from "@/components/ui/card";
import SaleStaffLayout from "@/app/components/SaleStaffLayout/SaleStaffLayout";

const CreateTripStep3: React.FC<CreateTourStep3Props> = ({
  onBack,
  onNext,
  data,
  updateData,
}) => {
  const [includes, setIncludes] = useState(data.includes ?? "");
  const [notIncludes, setNotIncludes] = useState(data.notIncludes ?? "");
  const [price, setPrice] = useState(data.price || []);
  console.log("Check", data);
  useEffect(() => {
    updateData({ ...data, includes, notIncludes, price: price ?? [] });
  }, [data, includes, notIncludes, price, updateData]);

  const handlePriceChange = (id: number, field: string, value: string) => {
    setPrice((prevPrice) =>
      prevPrice.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const [errors, setErrors] = useState<{ field: string }[]>([]);

  const validateForm = () => {
    const newErrors: { field: string }[] = [];

    if (!includes.trim()) {
      newErrors.push({ field: "includes" });
    }
    if (!notIncludes.trim()) {
      newErrors.push({ field: "notIncludes" });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };
  const addPrice = () => {
    setPrice([
      ...price,
      { id: Date.now(), start: "", end: "", rate: "", description: "" },
    ]);
  };

  useEffect(() => {
    updateData({ includes, notIncludes, price });
  }, [includes, notIncludes, price, updateData]);
  useEffect(() => {
    api
      .get("/config-templates/TourPrice")
      .then((response) => {
        if (response.data?.value) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fetchedPrices = response.data.value.map((price: any) => ({
            id: price.id,
            start: price.rangeStart.toString(),
            end: price.rangeEnd.toString(),
            rate: (price.rate * 100).toString(),
            description: price.description,
          }));
          setPrice(fetchedPrices);
        }
      })
      .catch((error) => {
        console.error("Error fetching policies:", error);
      });
  }, []);

  const removePrice = (id: number) => {
    setPrice(price.filter((item) => item.id !== id));
  };

  return (
    <SaleStaffLayout title="Create Tour">
      <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 uppercase">
          Tour Information Form
        </h2>
        <Card className="p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Cancel Price</h3>
          {price.map((item) => (
            <Card key={item.id} className="relative p-4 mb-4">
              <Button
                type="text"
                icon={<FiTrash size={16} className="text-red-500" />}
                className="absolute -top-1.5 -right-1.5"
                onClick={() => removePrice(item.id)}
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="Starting Point"
                  value={item.start}
                  onChange={(e) =>
                    handlePriceChange(item.id, "start", e.target.value)
                  }
                />
                <Input
                  placeholder="End Point"
                  value={item.end}
                  onChange={(e) =>
                    handlePriceChange(item.id, "end", e.target.value)
                  }
                />
                <Input
                  placeholder="Penalty Rate (%)"
                  value={item.rate}
                  onChange={(e) =>
                    handlePriceChange(item.id, "rate", e.target.value)
                  }
                />
              </div>
              <Input.TextArea
                className="w-full mt-4"
                placeholder="Description"
                rows={2}
                value={item.description}
                onChange={(e: { target: { value: string } }) =>
                  handlePriceChange(item.id, "description", e.target.value)
                }
              />
            </Card>
          ))}
          <Button
            type="dashed"
            onClick={addPrice}
            className="mt-4 w-xl text-blue-500 border-blue-500 hover:bg-blue-100"
          >
            + New Price
          </Button>
        </Card>
        <div>
          <Card className="p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Tour Price Includes</h3>
            <Input.TextArea
              className={`w-full ${
                errors.some((e) => e.field === "includes")
                  ? "border-red-500"
                  : ""
              }`}
              rows={4}
              value={includes}
              onChange={(e) => setIncludes(e.target.value)}
            />
            {errors.some((e) => e.field === "includes") && (
              <p className="text-red-500 text-sm mt-2">
                Tour Price Includes is required
              </p>
            )}
          </Card>
        </div>

        <div>
          <Card className="p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Tour Price Not Includes
            </h3>
            <Input.TextArea
              className={`w-full ${
                errors.some((e) => e.field === "notIncludes")
                  ? "border-red-500"
                  : ""
              }`}
              rows={4}
              value={notIncludes}
              onChange={(e) => setNotIncludes(e.target.value)}
            />
            {errors.some((e) => e.field === "notIncludes") && (
              <p className="text-red-500 text-sm mt-2">
                Tour Price Not Includes is required
              </p>
            )}
          </Card>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            onClick={onBack}
            className="flex items-center gap-2"
            icon={<FiArrowLeft size={20} />}
          >
            Back
          </Button>
          <Button type="primary" onClick={handleNext}>
            Next ➜
          </Button>
        </div>
      </div>
    </SaleStaffLayout>
  );
};

export default CreateTripStep3;
