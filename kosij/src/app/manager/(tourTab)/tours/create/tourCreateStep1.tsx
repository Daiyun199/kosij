/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
import { Button, Card, Form, Input, InputNumber, Select, Upload } from "antd";
import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { toast } from "react-toastify";

interface Step1Props {
  onNext: () => void;
  data: {
    tourName?: string;
    night?: number;
    day?: number;
    departure?: string;
    destination?: string;

    standardPrice?: number;
    visaFee?: number;
    img?: File | null;
  };
  updateData: (data: object) => void;
}

export default function CreateTourStep1({
  onNext,
  data,
  updateData,
}: Step1Props) {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [img, setImg] = useState<File | null>(data.img || null);

  useEffect(() => {
    const initialValues = {
      ...data,
      night: data.night || 1,
      day: (data.night || 1) + 1,
    };
    form.setFieldsValue(initialValues);
    setLoading(false);
  }, [data, form]);

  const handleNightChange = (value: number | null) => {
    const nights = value ?? 1;
    form.setFieldsValue({
      night: nights,
      day: nights + 1,
    });
  };

  const handleNext = () => {
    form.validateFields().then((values) => {
      const newData = {
        ...values,
        img,
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
      <ManagerLayout title="Tour Create">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout title="Tour Create">
      <div className="flex justify-center p-6">
        <Card className="p-6 w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-4">
            TOUR INFORMATION FORM
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

            <div className="flex justify-end">
              <Button type="primary" onClick={handleNext}>
                Next ➜
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </ManagerLayout>
  );
}
