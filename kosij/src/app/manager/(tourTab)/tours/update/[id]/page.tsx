"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  TimePicker,
  Card,
  Row,
  Col,
  Divider,
  Space,
  message,
  Collapse,
  Select,
  Upload,
  Image,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import api from "@/config/axios.config";
import { useParams, useRouter } from "next/navigation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebase";
import { toast } from "react-toastify";
import ManagerLayout from "@/app/components/ManagerLayout/ManagerLayout";
const { TextArea } = Input;
const { Panel } = Collapse;

interface Farm {
  id: number;
  farmName: string;
}
interface TimeType {
  hour: number;
  minute: number;
}

interface ItineraryDetail {
  id?: number;
  time: TimeType;
  description: string;
  farmId: number;
}

interface TourDetail {
  id?: number;
  day: number;
  itineraryName: string;
  itineraryDetails: ItineraryDetail[];
}

interface TourPrice {
  id?: number;
  ageFrom: number;
  ageTo: number;
  description: string;
  pricingRate: number;
}

interface TourPayment {
  id?: number;
  dayFrom: number;
  dayTo: number;
  description: string;
  depositRate: number;
}

interface TourCancellation {
  id?: number;
  dayFrom: number;
  dayTo: number;
  description: string;
  penaltyRate: number;
}

interface TourPromotion {
  id?: number;
  from: number;
  to: number;
  description: string;
  discountRate: number;
}

interface TourData {
  tourName: string;
  imageUrl: string;
  nights: number;
  departurePoint: string;
  destinationPoint: string;
  departureDate: string;
  tourPriceInclude: string;
  tourPriceNotInclude: string;
  standardPrice: number;
  visaFee: number;
  registrationDaysBefore: number;
  registrationConditions: string;
  tourDetailsRequests: TourDetail[];
  tourPriceRequests: TourPrice[];
  tourPaymentRequests: TourPayment[];
  tourCancellationRequests: TourCancellation[];
  tourPromotionRequests: TourPromotion[];
}

const TourUpdatePage: React.FC = () => {
  const [form] = Form.useForm();
  const params = useParams() as { id: string };
  const router = useRouter();
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const nights = Form.useWatch("nights", form);

  useEffect(() => {
    if (nights !== undefined && nights !== null) {
      const daysCount = nights + 1;
      const currentDetails = form.getFieldValue("tourDetailsRequests") || [];

      const newDetails = Array.from({ length: daysCount }, (_, index) => {
        return (
          currentDetails[index] || {
            day: index + 1,
            itineraryName: `Day ${index + 1}`,
            itineraryDetails: [],
          }
        );
      });

      form.setFieldsValue({ tourDetailsRequests: newDetails });
    }
  }, [nights, form]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const storageRef = ref(storage, `tours/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setImageUrl(downloadURL);
      form.setFieldsValue({ imageUrl: downloadURL });
      message.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      message.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
    if (id) {
      fetchTourData();
    }
  }, [id]);

  const getSelectedFarmIds = (): number[] => {
    const formValues = form.getFieldsValue();

    if (!formValues.tourDetailsRequests) return [];

    return formValues.tourDetailsRequests.flatMap((detail: any) =>
      (detail.itineraryDetails || [])
        .map((itinerary: any) => itinerary?.farmId)
        .filter(
          (farmId: number | null | undefined): farmId is number =>
            farmId !== null && farmId !== undefined
        )
    );
  };

  const fetchFarms = async () => {
    try {
      const response = await api.get("farms");
      const farmList = response.data.value.map((farm: any) => ({
        id: farm.id,
        farmName: farm.farmName,
      }));
      setFarms(farmList);
    } catch (error) {
      console.error("Failed to fetch farms", error);
    }
  };

  const convertTimeStringToDayjs = (timeString: string): Dayjs => {
    if (!timeString) return dayjs().hour(0).minute(0);

    if (timeString.includes("AM") || timeString.includes("PM")) {
      return dayjs(timeString, "hh:mm A");
    }

    return dayjs(timeString, "HH:mm");
  };

  const fetchTourData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tour/${id}`);
      const data = response.data.value;

      const parseDepartureDate = (dateString: string) => {
        if (!dateString) return undefined;

        if (dateString.includes("-")) {
          const parts = dateString.split("-");
          if (parts.length === 3) {
            return dayjs(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }

        return dayjs(dateString);
      };

      const formattedData = {
        tourName: data.tourName,
        imageUrl: data.imageUrl,
        nights: data.nights,
        departurePoint: data.departurePoint,
        destinationPoint: data.destinationPoint,

        tourPriceInclude: data.tourPriceInclude,
        tourPriceNotInclude: data.tourPriceNotInclude,
        standardPrice: data.standardPrice,
        visaFee: data.visaFee,
        registrationDaysBefore: data.registrationDaysBefore,
        registrationConditions: data.registrationConditions,

        tourDetailsRequests:
          data.tourDetails?.map((detail: any) => ({
            id: detail.id,
            day: detail.day,
            itineraryName: detail.itineraryName,
            itineraryDetails: detail.itineraryDetails?.map(
              (itinerary: any) => ({
                id: itinerary.id,
                time: convertTimeStringToDayjs(itinerary.time),
                description: itinerary.description,
                farmId: itinerary.farmId,
              })
            ),
          })) || [],
        tourPriceRequests: data.tourPrices || [],
        tourPaymentRequests: data.paymentPolicy || [],
        tourCancellationRequests: data.cancellationPolicy || [],
        tourPromotionRequests: data.promotionPolicy || [],
      };

      form.setFieldsValue(formattedData);
      setImageUrl(formattedData.imageUrl);
    } catch (error) {
      message.error("Failed to fetch tour data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      const actualValues = form.getFieldsValue();

      const formattedTourDetails = values.tourDetailsRequests.map(
        (detail: any) => ({
          ...detail,
          itineraryDetails: detail.itineraryDetails.map((itinerary: any) => ({
            ...itinerary,
            time: {
              hour: itinerary.time.hour(),
              minute: itinerary.time.minute(),
            },
          })),
        })
      );

      const requestBody = {
        tourName: values.tourName,
        imageUrl: values.imageUrl,
        nights: values.nights,
        departurePoint: values.departurePoint,
        destinationPoint: values.destinationPoint,

        tourPriceInclude: values.tourPriceInclude,
        tourPriceNotInclude: values.tourPriceNotInclude,
        standardPrice: values.standardPrice,
        visaFee: values.visaFee,
        registrationDaysBefore: values.registrationDaysBefore,
        registrationConditions: values.registrationConditions,
        tourDetailsRequests: formattedTourDetails || [],
        tourPriceRequests: values.tourPriceRequests || [],
        tourPaymentRequests: values.tourPaymentRequests || [],
        tourCancellationRequests: values.tourCancellationRequests || [],
        tourPromotionRequests: values.tourPromotionRequests || [],
      };

      console.log("Request Body:", requestBody);

      await api.put(`/tour/${id}`, requestBody);
      toast.success("Tour updated successfully");
      router.push(`/manager/tours/${id}`);
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.value || error.message || "Failed to update tour";
      toast.error(errorMessage);
      console.error("Update tour error:", error);
    }
  };

  return (
    <ManagerLayout title="Update Tour">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Update Tour</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="bg-white p-6 rounded-lg shadow"
        >
          <Card title="Basic Information" className="mb-6">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Tour Name"
                  name="tourName"
                  rules={[
                    { required: true, message: "Please enter tour name" },
                  ]}
                >
                  <Input placeholder="Enter tour name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Tour Image"
                  name="imageUrl"
                  rules={[
                    { required: true, message: "Please upload tour image" },
                  ]}
                >
                  <div className="flex flex-col items-center gap-4">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt="Tour preview"
                        width={500}
                        height="auto"
                        className="rounded-lg object-cover border shadow-sm"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    )}
                    <Upload
                      accept="image/*"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleUpload(file);
                        return false;
                      }}
                      className="w-full"
                    >
                      <Button
                        icon={<UploadOutlined />}
                        loading={uploading}
                        className="w-full max-w-xs"
                        size="large"
                      >
                        {uploading ? "Uploading..." : "Click to Upload Image"}
                      </Button>
                    </Upload>
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Number of Nights"
                  name="nights"
                  rules={[
                    {
                      required: true,
                      message: "Please enter number of nights",
                    },
                  ]}
                >
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Departure Point"
                  name="departurePoint"
                  rules={[
                    { required: true, message: "Please enter departure point" },
                  ]}
                >
                  <Input placeholder="Enter departure point" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Destination Point"
                  name="destinationPoint"
                  rules={[
                    {
                      required: true,
                      message: "Please enter destination point",
                    },
                  ]}
                >
                  <Input placeholder="Enter destination point" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Price Includes"
                  name="tourPriceInclude"
                  rules={[
                    {
                      required: true,
                      message: "Please enter what price includes",
                    },
                  ]}
                >
                  <TextArea rows={3} placeholder="Enter what price includes" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Price Excludes"
                  name="tourPriceNotInclude"
                  rules={[
                    {
                      required: true,
                      message: "Please enter what price excludes",
                    },
                  ]}
                >
                  <TextArea rows={3} placeholder="Enter what price excludes" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Registration Conditions"
                  name="registrationConditions"
                  rules={[
                    {
                      required: true,
                      message: "Please enter registration conditions",
                    },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Enter registration conditions"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Registration Days Before"
                  name="registrationDaysBefore"
                  rules={[
                    {
                      required: true,
                      message: "Please enter registration days before",
                    },
                  ]}
                >
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Pricing Information" className="mb-6">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Standard Price"
                  name="standardPrice"
                  rules={[
                    { required: true, message: "Please enter standard price" },
                  ]}
                >
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Visa Fee"
                  name="visaFee"
                  rules={[{ required: true, message: "Please enter visa fee" }]}
                >
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Collapse className="mb-6" destroyInactivePanel={false}>
            <Panel header="Tour Itinerary" key="1" forceRender>
              <Form.List name="tourDetailsRequests">
                {(fields, { remove }) => (
                  <div className="space-y-6">
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        className="shadow-sm"
                        title={
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Day {name + 1}</span>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                              className="hover:bg-red-50"
                            />
                          </div>
                        }
                      >
                        <div className="space-y-4">
                          <Form.Item
                            {...restField}
                            name={[name, "itineraryName"]}
                            label="Itinerary Name"
                            rules={[
                              {
                                required: true,
                                message: "Please enter itinerary name",
                              },
                            ]}
                          >
                            <Input
                              placeholder="E.g: Day 1 - Exploring Tokyo"
                              className="w-full"
                            />
                          </Form.Item>

                          <Form.List name={[name, "itineraryDetails"]}>
                            {(subFields, subOpt) => (
                              <div className="space-y-4">
                                {subFields.map((subField) => (
                                  <Card
                                    key={subField.key}
                                    size="small"
                                    className="bg-gray-50 border-gray-200"
                                  >
                                    <Row gutter={16} align="middle">
                                      <Col span={6}>
                                        <Form.Item
                                          {...restField}
                                          name={[subField.name, "time"]}
                                          label="Time"
                                          rules={[
                                            {
                                              required: true,
                                              message: "Please select time",
                                            },
                                            {
                                              validator: (_, value) => {
                                                if (!value)
                                                  return Promise.resolve();

                                                const allActivities =
                                                  form.getFieldValue([
                                                    "tourDetailsRequests",
                                                    name,
                                                    "itineraryDetails",
                                                  ]);

                                                const currentIndex =
                                                  subField.name;
                                                const prevActivity =
                                                  allActivities?.[
                                                    currentIndex - 1
                                                  ];

                                                if (prevActivity?.time) {
                                                  const prevTime = dayjs(
                                                    prevActivity.time
                                                  );
                                                  const currentTime =
                                                    dayjs(value);

                                                  if (
                                                    currentTime.isBefore(
                                                      prevTime.add(1, "minute")
                                                    )
                                                  ) {
                                                    return Promise.reject(
                                                      "Time must be after the previous activity's time"
                                                    );
                                                  }
                                                }

                                                return Promise.resolve();
                                              },
                                            },
                                          ]}
                                        >
                                          <TimePicker
                                            format="HH:mm"
                                            className="w-full"
                                            placeholder="Select time"
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col span={6}>
                                        <Form.Item
                                          {...restField}
                                          name={[subField.name, "farmId"]}
                                          label="Farm"
                                          rules={[
                                            {
                                              validator: (_, value) => {
                                                const selectedFarmIds =
                                                  getSelectedFarmIds();
                                                const currentValue =
                                                  form.getFieldValue([
                                                    "tourDetailsRequests",
                                                    name,
                                                    "itineraryDetails",
                                                    subField.name,
                                                    "farmId",
                                                  ]);

                                                if (
                                                  value &&
                                                  selectedFarmIds.filter(
                                                    (id) => id === value
                                                  ).length > 1
                                                ) {
                                                  return Promise.reject(
                                                    "This farm has already been selected"
                                                  );
                                                }
                                                return Promise.resolve();
                                              },
                                            },
                                          ]}
                                        >
                                          <Select
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                              String(option?.label ?? "")
                                                .toLowerCase()
                                                .includes(
                                                  String(input).toLowerCase()
                                                )
                                            }
                                            placeholder="Select farm"
                                            disabled={
                                              getSelectedFarmIds().includes(
                                                form.getFieldValue([
                                                  "tourDetailsRequests",
                                                  name,
                                                  "itineraryDetails",
                                                  subField.name,
                                                  "farmId",
                                                ])
                                              ) &&
                                              form.getFieldValue([
                                                "tourDetailsRequests",
                                                name,
                                                "itineraryDetails",
                                                subField.name,
                                                "farmId",
                                              ]) !==
                                                form.getFieldValue([
                                                  "tourDetailsRequests",
                                                  name,
                                                  "itineraryDetails",
                                                  subField.name,
                                                  "farmId",
                                                ])
                                            }
                                          >
                                            {farms.map((farm) => (
                                              <Select.Option
                                                key={farm.id}
                                                value={farm.id}
                                                disabled={
                                                  getSelectedFarmIds().includes(
                                                    farm.id
                                                  ) &&
                                                  form.getFieldValue([
                                                    "tourDetailsRequests",
                                                    name,
                                                    "itineraryDetails",
                                                    subField.name,
                                                    "farmId",
                                                  ]) !== farm.id
                                                }
                                              >
                                                {farm.farmName}
                                                {getSelectedFarmIds().includes(
                                                  farm.id
                                                ) &&
                                                  form.getFieldValue([
                                                    "tourDetailsRequests",
                                                    name,
                                                    "itineraryDetails",
                                                    subField.name,
                                                    "farmId",
                                                  ]) !== farm.id &&
                                                  " (Already selected)"}
                                              </Select.Option>
                                            ))}
                                          </Select>
                                        </Form.Item>
                                      </Col>
                                      <Col span={10}>
                                        <Form.Item
                                          {...restField}
                                          name={[subField.name, "description"]}
                                          label="Activity Description"
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Please enter description",
                                            },
                                          ]}
                                        >
                                          <Input.TextArea
                                            placeholder="Describe the activity..."
                                            autoSize={{
                                              minRows: 1,
                                              maxRows: 3,
                                            }}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col span={2}>
                                        <Button
                                          type="text"
                                          danger
                                          icon={<DeleteOutlined />}
                                          onClick={() =>
                                            subOpt.remove(subField.name)
                                          }
                                          className="flex items-center justify-center"
                                        />
                                      </Col>
                                    </Row>
                                  </Card>
                                ))}

                                <Button
                                  type="dashed"
                                  onClick={() => {
                                    const currentActivities =
                                      form.getFieldValue([
                                        "tourDetailsRequests",
                                        name,
                                        "itineraryDetails",
                                      ]);
                                    let newTime = null;

                                    if (
                                      currentActivities &&
                                      currentActivities.length > 0
                                    ) {
                                      const lastActivity =
                                        currentActivities[
                                          currentActivities.length - 1
                                        ];
                                      const lastTime = lastActivity?.time;
                                      if (lastTime) {
                                        newTime = dayjs(lastTime).add(
                                          15,
                                          "minute"
                                        );
                                      }
                                    }
                                    subOpt.add({
                                      time: newTime,
                                      farmId: undefined,
                                      description: "",
                                    });
                                  }}
                                  icon={<PlusOutlined />}
                                  className="w-full"
                                >
                                  Add Activity
                                </Button>
                              </div>
                            )}
                          </Form.List>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Form.List>
            </Panel>
          </Collapse>

          <Collapse className="mb-6" destroyInactivePanel={false}>
            <Panel header="Tour Prices" key="2" forceRender>
              <Form.List name="tourPriceRequests">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={16} className="mb-4">
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "ageFrom"]}
                            label="Age From"
                            rules={[
                              {
                                required: true,
                                message: "Please enter age from",
                              },
                            ]}
                          >
                            <InputNumber min={0} className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "ageTo"]}
                            label="Age To"
                            rules={[
                              {
                                required: true,
                                message: "Please enter age to",
                              },
                            ]}
                          >
                            <InputNumber min={0} className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, "pricingRate"]}
                            label="Pricing Rate (%)"
                            rules={[
                              {
                                required: true,
                                message: "Please enter pricing rate",
                              },
                            ]}
                          >
                            <InputNumber min={0} max={100} className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "description"]}
                            label="Description"
                            rules={[
                              {
                                required: true,
                                message: "Please enter description",
                              },
                            ]}
                          >
                            <Input placeholder="Enter description" />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                            className="mt-7"
                          />
                        </Col>
                      </Row>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      block
                    >
                      Add Price
                    </Button>
                  </>
                )}
              </Form.List>
            </Panel>
          </Collapse>

          <Collapse className="mb-6" destroyInactivePanel={false}>
            <Panel header="Payment Policies" key="3" forceRender>
              <Form.List name="tourPaymentRequests">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={16} className="mb-4">
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "dayFrom"]}
                            label="Day From"
                            rules={[
                              {
                                required: true,
                                message: "Please enter day from",
                              },
                            ]}
                          >
                            <InputNumber min={0} className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "dayTo"]}
                            label="Day To"
                            rules={[
                              {
                                required: true,
                                message: "Please enter day to",
                              },
                            ]}
                          >
                            <InputNumber min={0} className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, "depositRate"]}
                            label="Deposit Rate (%)"
                            rules={[
                              {
                                required: true,
                                message: "Please enter deposit rate",
                              },
                            ]}
                          >
                            <InputNumber min={0} max={100} className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "description"]}
                            label="Description"
                            rules={[
                              {
                                required: true,
                                message: "Please enter description",
                              },
                            ]}
                          >
                            <Input placeholder="Enter description" />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                            className="mt-7"
                          />
                        </Col>
                      </Row>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      block
                    >
                      Add Payment Policy
                    </Button>
                  </>
                )}
              </Form.List>
            </Panel>
          </Collapse>

          <Collapse className="mb-6" destroyInactivePanel={false}>
            <Panel header="Cancellation Policies" key="4" forceRender>
              <Form.List name="tourCancellationRequests">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={16} className="mb-4">
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "dayFrom"]}
                            label="Day From"
                            rules={[
                              {
                                required: true,
                                message: "Please enter day from",
                              },
                            ]}
                          >
                            <InputNumber min={0} className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "dayTo"]}
                            label="Day To"
                            rules={[
                              {
                                required: true,
                                message: "Please enter day to",
                              },
                            ]}
                          >
                            <InputNumber min={0} className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, "penaltyRate"]}
                            label="Penalty Rate (%)"
                            rules={[
                              {
                                required: true,
                                message: "Please enter penalty rate",
                              },
                            ]}
                          >
                            <InputNumber min={0} max={100} className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "description"]}
                            label="Description"
                            rules={[
                              {
                                required: true,
                                message: "Please enter description",
                              },
                            ]}
                          >
                            <Input placeholder="Enter description" />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                            className="mt-7"
                          />
                        </Col>
                      </Row>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      block
                    >
                      Add Cancellation Policy
                    </Button>
                  </>
                )}
              </Form.List>
            </Panel>
          </Collapse>

          <Collapse className="mb-6">
            <Panel header="Promotions" key="5" forceRender>
              <Form.List name="tourPromotionRequests">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={16} className="mb-4">
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "from"]}
                            label="From (days)"
                            rules={[
                              { required: true, message: "Please enter from" },
                            ]}
                          >
                            <InputNumber min={0} className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "to"]}
                            label="To (days)"
                            rules={[
                              { required: true, message: "Please enter to" },
                            ]}
                          >
                            <InputNumber min={0} className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, "discountRate"]}
                            label="Discount Rate (%)"
                            rules={[
                              {
                                required: true,
                                message: "Please enter discount rate",
                              },
                            ]}
                          >
                            <InputNumber min={0} max={100} className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "description"]}
                            label="Description"
                            rules={[
                              {
                                required: true,
                                message: "Please enter description",
                              },
                            ]}
                          >
                            <Input placeholder="Enter description" />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                            className="mt-7"
                          />
                        </Col>
                      </Row>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      block
                    >
                      Add Promotion
                    </Button>
                  </>
                )}
              </Form.List>
            </Panel>
          </Collapse>

          <div className="flex justify-end space-x-4 mt-6">
            <Button onClick={() => router.push(`/manager/tours/${id}`)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Tour
            </Button>
          </div>
        </Form>
      </div>
    </ManagerLayout>
  );
};

export default TourUpdatePage;
