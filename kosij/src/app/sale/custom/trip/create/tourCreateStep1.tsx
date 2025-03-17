/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import SaleStaffLayout from "@/app/components/ManagerLayout/ManagerLayout";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from "antd";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
dayjs.extend(timezone);
dayjs.extend(utc);
import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { toast } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { TripRequestScpeacial } from "@/model/TripRequestSpeacial";
import api from "@/config/axios.config";
interface Step1Props {
  tripRequestId?: any;
  onBack: () => void;
  onNext: () => void;
  data: {
    departureDate?: any;
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
    pricingRate?: any;
  };
  updateData: (data: object) => void;
}

export default function CreateTripStep1({
  onBack,
  onNext,
  data,
  updateData,
  tripRequestId,
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

  const [pricingRate, setPricingRate] = useState(data.pricingRate || 1);
  const [departureDate, setDepartureDate] = useState(data.departureDate || "");
  const [registrationConditions, setRegistrationConditions] = useState(
    data.registrationConditions || ""
  );
  const [standardPrice, setStandardPrice] = useState(data.standardPrice || 0);
  const [visaFee, setVisaFee] = useState(data.visaFee || 0);
  const [img, setImg] = useState<File | null>(data.img || null);
  const router = useRouter();
  const [trip, setTrip] = useState<TripRequestScpeacial | null>(null);
  useEffect(() => {
    api
      .get(`/staff/trip-request/${tripRequestId}`)
      .then((response) => {
        const data = response.data.value;

        console.log("API Response:", data);

        if (data.departureDate) {
          const parsedDate = dayjs(data.departureDate, "DD-MM-YYYY HH:mm:ss");

          console.log("Parsed Date:", parsedDate.format("YYYY-MM-DD"));

          setDepartureDate(parsedDate);
        }

        setTrip(data);
        setNight(data.nights);
        setDeparture(data.departurePoint);
      })
      .catch((error) => console.error("Error fetching data:", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setDay(night + 1);
  }, [night]);
  useEffect(() => {
    form.setFieldsValue({
      departureDate,
      tourName,
      night,
      day,
      departure,
      destination,
      registrationDaysBefore,
      registrationConditions,
      standardPrice,
      visaFee,
      pricingRate,
    });
    setLoading(false);
  }, [
    departureDate,
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
    pricingRate,
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
  const handleBack = () => {
    router.push(`/sale/requests/${tripRequestId}`);
  };
  const handleUpload = (file: File) => {
    setImg(file);
    return false;
  };

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      setDepartureDate("");
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
              <Form.Item
                label="Departure Date:"
                name="departureDate"
                rules={[
                  {
                    required: true,
                    message: "Please select the departure date!",
                  },
                ]}
              >
                <DatePicker
                  className="w-full"
                  value={departureDate ? dayjs(departureDate) : null}
                  onChange={(date, dateString) => setDepartureDate(dateString)}
                  format="YYYY-MM-DD"
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

            <Form.Item label="Upload Tour Image:">
              <Upload
                beforeUpload={handleUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
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

            <div className="flex justify-between mt-6">
              <Button
                type="default"
                icon={<FiArrowLeft />}
                onClick={handleBack}
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
