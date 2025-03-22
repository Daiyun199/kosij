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
    registrationDaysBefore?: number;
    registrationConditions?: string;
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
  const [tourName, setTourName] = useState(data.tourName || "");
  const [night, setNight] = useState(data.night || 1);
  const [day, setDay] = useState((data.night || 0) + 1);
  const [departure, setDeparture] = useState(data.departure || "");
  const [destination, setDestination] = useState(data.destination || "");
  const [registrationDaysBefore, setRegistrationDaysBefore] = useState(
    data.registrationDaysBefore || 1
  );
  const [registrationConditions, setRegistrationConditions] = useState(
    data.registrationConditions || ""
  );
  const [standardPrice, setStandardPrice] = useState(data.standardPrice || 0);
  const [visaFee, setVisaFee] = useState(data.visaFee || 0);
  const [img, setImg] = useState<File | null>(data.img || null);
  useEffect(() => {
    setDay(night + 1);
  }, [night]);
  useEffect(() => {
    form.setFieldsValue({
      tourName,
      night,
      day,
      departure,
      destination,
      registrationDaysBefore,
      registrationConditions,
      standardPrice,
      visaFee,
    });
    setLoading(false);
  }, [
    form,
    tourName,
    night,
    day,
    departure,
    destination,
    registrationDaysBefore,
    registrationConditions,
    standardPrice,
    visaFee,
  ]);

  const handleNext = () => {
    form.validateFields().then((values) => {
      const newData = {
        ...values,
        img,
      };

      console.log("Step 1 - New Data Before Update:", newData);
      updateData(newData);
      onNext();
    });
  };

  const handleUpload = (file: File) => {
    setImg(file);
    return false;
  };

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      setTourName("");
      setNight(1);
      setDay(2);
      setDeparture("");
      setDestination("");
      setRegistrationDaysBefore(1);
      setRegistrationConditions("");
      setStandardPrice(0);
      setVisaFee(0);
      setImg(null);
    }
  }, [data]);
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
          <Form layout="vertical" form={form} initialValues={data}>
            <Form.Item
              label="Tour Name:"
              name="tourName"
              rules={[
                { required: true, message: "Please input the Tour name!!!" },
              ]}
            >
              <Input placeholder="Enter tour name" value={tourName} />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Nights:"
                name="night"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} className="w-full" value={night} />
              </Form.Item>
              <Form.Item label="Days (Auto):" name="day">
                <InputNumber className="w-full" readOnly disabled value={day} />
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
              <Input
                placeholder="Enter destination points"
                value={destination}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Registration Days Before:"
                name="registrationDaysBefore"
                rules={[
                  {
                    required: true,
                    message: "Please input the Registration Days Before!!!",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  className="w-full"
                  value={registrationDaysBefore}
                />
              </Form.Item>
              <Form.Item
                label="Registration Conditions:"
                name="registrationConditions"
                rules={[
                  {
                    required: true,
                    message: "Please input the Registration Conditions!!!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter registration conditions"
                  value={registrationConditions}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Standard Price (VND):" name="standardPrice">
                <InputNumber
                  min={0}
                  className="w-full"
                  value={standardPrice}
                  formatter={(value) =>
                    value
                      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : "0"
                  }
                  parser={(value) => Number(value?.replace(/,/g, "") || "0")}
                />
              </Form.Item>

              <Form.Item label="Visa Fee (VND):" name="visaFee">
                <InputNumber
                  min={0}
                  className="w-full"
                  value={visaFee}
                  formatter={(value) =>
                    value
                      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : "0"
                  }
                  parser={(value) => Number(value?.replace(/,/g, "") || "0")}
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
